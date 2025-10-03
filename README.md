# Apollonian Circles

[<img width="1920" height="955" alt="apollonian-circles" src="https://github.com/user-attachments/assets/7333aaf5-62ac-4e4e-9430-b39797ba7b6e" />](<https://halbfettkaese.github.io/apollonian-circles/>)

A simple website hosting a demo on apollonian circles, accessible at https://halbfettkaese.github.io/apollonian-circles/.

Click anywhere on the canvas to toggle interactivity.

## Mathematical breakdown

The math is based on https://arxiv.org/abs/math/0101066. However, just reading this still does not make it easy to understand how to turn the math written there into useful formulas or how to derive an algorithm from them.

The fundamental equations that the algorithm uses are known as [Descartes' theorem](https://en.wikipedia.org/wiki/Descartes%27_theorem), which relates the radii and positions of any group of four mutually tangents to each other.

### Regular Descartes

Defining a circle's *bend* or *curvature* as $b=1/r$, Descartes' theorem consists of the following equation:

$$b_1^2+b_2^2+b_3^2+b_4^2=\frac{1}{2}\left(b_1+b_2+b_3+b_4\right)^2$$

With this being a quadratic equation, it's easy to become inspired to finally find a use for the quadratic formula and solve for the fourth variable. Indeed, exactly this is what the Wikipedia article recommends doing, as it gives this formula for finding the bend of the 4th circle, while taking the first three bends as given:

$$b_4=b_1+b_2+b_3\pm2\sqrt{b_1b_2+b_1b_3+b_2b_3}$$

<img width="1920" height="955" alt="apollonian-circles-bends" src="https://github.com/user-attachments/assets/7116b029-745c-4b81-b94a-bbd9e4d66aad" />

Note how with this, every three mutually tangent circles have two different candidates for a fourth circle that would be tangent to all of the original circles. Furthermore, declaring $D=2\sqrt{b_1b_2+b_1b_3+b_2b_3}$, the above equation simplifies to giving the two solutions:

$$
b_4=b_1+b_2+b_3+D
$$
$$
b_4'=b_1+b_2+b_3-D
$$

Seeing these equations above each other shows something that would otherwise not be immediately obvious: When you add $b_4$ and $b_4'$ together, the $D$ and the $-D$ cancel each other out, and you get just a linear equation!

$$
b_4+b_4'=2(b_1+b_2+b_3)
$$

This means that all of the pain that comes with applying the quadratic formula wasn't necessary after all. You simply need to start with four mutually tangent circles, declare three of them to be the "original" circles with bends $b_1, b_2, b_3$ while the remaining one is just one of the two circles neighboring them with bend $b_4$, and the equation above gives the unique and easy to compute formula for a fifth circle: $b_4'=2(b_1+b_2+b_3)-b_4$.

Note that the particular choice of which of the four starting circles to pick as the outsider to reflect over the other three circles was just arbitrary. You could have picked any one of the four circles to reflect over the others, and each would have given a different new circle that is tangent to three of the four original circles. It is only after starting to iterate this process that you need to be slightly careful about which choice to make: One of the four choices just un-does the previous move that added the exact circle that the current move would be removing. So an algorithm should always remember which circle was last added to any pair of four, and make sure to only make moves that would replace one of the other three with yet another new circle.

As such, an algorithm for generating more circle bends matching the previous ones may look like this:
```js
// Initialize queue of four-circle-groups. Each group has the last added circle as the fourth element.
let queue = [ [-3, 5, 8, 8] ];
let result = [...queue[0]];
function add_group(b1, b2, b3, b4) {
  if (b4 > 80) return; // Skip over the small circles
  result.push(b4);
  queue.push([b1, b2, b3, b4]);
}
for (let i = 0; i < 10 && queue.length > 0; i++) {
  let [b1, b2, b3, b4] = queue.shift();
  add_group(b2, b3, b4, 2*(b2+b3+b4)-b1); // Reflect b1 over b2,b3,b4
  add_group(b1, b3, b4, 2*(b1+b3+b4)-b2); // Reflect b2 over b1,b3,b4
  add_group(b1, b2, b4, 2*(b1+b2+b4)-b3); // Reflect b3 over b1,b2,b4
  // Don't reflect b4 over the others, as that would undo the reflection that just created b4
}

console.log(...result); // -3 5 8 8 45 21 12 77 44 44 53 29 20 77 77 68 56 77 53 32
```
Recreating the numbers found on this Wikipedia image:

[<img width="300" height="300" alt="ApollonianGasket-3_5_8_8-Labels" src="https://github.com/user-attachments/assets/646e1342-366b-47e7-9326-8d6c272b53e9" />](https://en.wikipedia.org/wiki/File:ApollonianGasket-3_5_8_8-Labels.png)

### Complex Descartes

All of this is fine and easy, but knowing just the circle bends is useless if we still don't know where the circles should actually be placed. This is where the complex Descartes' theorem comes in. It owes its name to the fact that it is completely analogous to the original Descartes' theorem:

$$
(z_1b_1)^2+(z_2b_2)^2+(z_3b_3)^2+(z_4b_4)^2=\frac{1}{2}\left(z_1b_1+z_2b_2+z_3b_3+z_4b_4\right)^2
$$

In this, $z_1, z_2, z_3, z_4$ are complex numbers that each represent the center of one of the four touching circles. After substituting $u_i:=z_ib_i$, the equation actually becomes the exact same as the original Descartes' theorem, except that the numbers it relates are different ones. With this, we can directly apply the result that we previously derived for the bends:

$$
u_4'=2(u_1+u_2+u_3)-u_4
$$

This makes it clear that getting the previous algorithm to also work for computing more circle centers just means adding more dimensions to the respective linear equations. Once $u=zb$ and $b$ are known for a given circle, the circle center is easy to extract as $z=u/b$.

### Starting from three circles

The explanations so far should have made clear how much easier the math is when you start with a group of four mutually tangent circles and use those to generate more such groups of four.

However, this still doesn't answer the question of how you find four of these circles to start with. Finding examples of just three starting circles is easy, for example you could have one big circle of radius $1$ and place two smaller circles of radius $1/2$ inside the big circle along its diameter. But finding a fourth circle by hand is just more difficult, and could benefit from a standardized method.

For this, we can again use Descartes' theorem, but this time, we can actually use the results from the quadratic formula on the regular and the complex Descartes' theorem:

$$
b_4=b_1+b_2+b_3\pm2\sqrt{b_1b_2+b_1b_3+b_2b_3}
$$
$$
u_4=u_1+u_2+u_3\pm2\sqrt{u_1u_2+u_1u_3+u_2u_3}
$$

However, this naive approach quickly runs into problems: The first equation has two different solutions depending on whether you choose the $+$ or the $-$ sign, and the second equation also has two different solutions in the same way. In total, this would give four combinations, even though there are always only exactly two different circles that are tangent to the original three. One might hope that there is a consistent way in which the sign from one equation can be matched with the sign of the other equation, but after some experimentation, it becomes apparent that every combination has some cases where it is correct and some cases where it is incorrect.

What saves us here is an equation given relatively near the start of the paper I referenced at the start, [Beyond the Descartes circle theorem](https://arxiv.org/abs/math/0101066):

$$
\sum_{j=1}^4 b_ju_j=\frac{1}{2}\left(\sum_{j=1}^4b_j\right)\left(\sum_{j=1}^4u_j\right)
$$

According to the paper, this equation is derived by substituting $z_i$ with $z_i+w$ inside the complex Descartes' theorem for an arbitrary complex number $w$, and comparing the resulting coefficients on both sides of the equation for different powers of $w$, which supposedly leads to both the original Descartes' theorem and this new equation. While I don't understand why the specific approach described by the paper is valid, as the complex Descartes' theorem does not state that the equation would have to hold for multiple values of $w$ while keeping the rest fixed, which, to my understanding, would be necessary for directly equating the different coefficients of $w$ (I would appreciate insight on this), if we just take the equation for granted, it gives us exactly what we still need.

This is because we now have a linear equation that can be solved for a unique value of $u_4$, given a choice for $b_4$. This means we just get the two valid combinations of bend and circle center. Solving the linear equation above for $u_4$ (and declaring $S:=\frac{1}{2}\sum_{j=1}^4b_j$), we get:

$$
u_4=\frac{-\sum_{j=1}^3 (b_j-S)u_j}{b_4-S}
$$

What stands out there is that we're dividing by $b_4-S=b_4-(b_1+b_2+b_3+b_4)/2=-(b_1+b_2+b_3-b_4)/2$, which would lead to problems if this quantity is 0. However, this condition can be restated as $b_4=b_1+b_2+b_3$, which, when compared to the above result of the quadratic formula, can be recognized as being exactly the case where the discriminant was 0 and the quadratic formula gives only one bend. In this case, you can simply use the quadratic formula on the complex Descartes' theorem to get the two different circle centers that share the same bend.

With this, we have found a way to always get the two different circles that are tangent to the three original mutually tangent circles.

### Summary
Getting the two circles that are tangent to 3 given circles:
1. Start with 3 mutually tangent circles. Their properties can be known through simple geometry and intuition.
2. Use the quadratic formula to find the two different bends $b4$ and $b4'$ of the two different circles that are tangent to the original 3 circles:<br/>
$$b_4=b_1+b_2+b_3\pm2\sqrt{b_1b_2+b_1b_3+b_2b_3}$$<br/>
3. If the two bends are the same (i.e. the discriminant was 0), use the quadratic formula on the complex Descartes' theorem (where $u_i=z_ib_i$, with $z_i$ being the complex number corresponding to the circle center) to find the two different circle centers matching that same bend:<br/>
$$u_4=u_1+u_2+u_3\pm2\sqrt{u_1u_2+u_1u_3+u_2u_3}$$<br/>
4. Otherwise, use the solution to the linear equation to find the unique circle centers matching each of the two found bends:<br/>
$$S=\frac{1}{2}(b_1+b_2+b_3+b_4)$$<br/>
$$u_4=\frac{-\sum_{j=1}^3 (b_j-S)u_j}{b_4-S}$$

Getting the one circle that is tangent to 3 out of 4 given circles:
1. Start with 4 mutually tangent circles with bends $b_1, b_2, b_3, b_4$ and centers $z_1, z_2, z_3, z_4$, with $u_i:=z_ib_i$.
2. A new circle that is tangent to the first three circles is given by $b_4' = 2(b_1+b_2+b_3)-b_4$ and $u_4'=2(u_1+u_2+u_3)-u_4$.

### Notes

You might have noticed that the circle bends are sometimes negative. This simply determines whether other circles should be on a given circle's inside or outside. In general, two touching circles have one inside the other if the signs of their bends are different. The circles can be drawn to the screen as if their radius corresponds to the absolute value of their bend.

Straight lines can also occur as part of these calculations, as they are degenerate forms of a circle in the case where there is 0 bend, or in other words, infinitely large circles. [Beyond the Descartes circle theorem](https://arxiv.org/abs/math/0101066) describes a method to deal with this using circle inversion, which doesn't even seem computationally complex, but my code worked well enough by just hiding the circles when they became too large, as there were already precision issues before the gigantic circles became straight lines.
