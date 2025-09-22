export class SortedList<T> extends Array {
    compare: (a: T, b: T) => number;
    constructor(compare?: (a: T, b: T) => number, initElements?: T[]) {
        super();
        this.compare = compare ?? ((a, b) => {
            if (a < b) return 1;
            if (a == b) return 0;
            return -1;
        });
        if (initElements) {
            initElements.forEach(el => this.insert(el));
        }
    }

    insert(x: T) {
        var idx = this.binarySearch(x);
        this.splice(idx, 0, x);
        return this;
    }

    binarySearch(x: T): number {
        var lower = 0;
        var upper = this.length - 1;
        while (lower <= upper) {
            var middle = (lower + upper) >> 1;
            if (this.compare(x, this[middle]) < 0) {
                lower = middle + 1;
            }
            else {
                upper = middle - 1;
            }
        }
        return lower;
    }
}