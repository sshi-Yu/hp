
export class PageVo {
    private pageNum: number | null;
    private pageSize: number | null;
    private total: number | null;
    private data: unknown;

    constructor({ pageNum: _pageNum,
        pageSize: _pageSize,
        total: _total,
        data: _data }: {
            pageNum: number,
            pageSize: number,
            total: number,
            data: unknown
        }) {
        this.pageNum = +_pageNum;
        this.pageSize = +_pageSize;
        this.total = +_total;
        this.data = _data;
    }

    getData() {
        return this.data;
    }

    setData(data: unknown) {
        this.data = data;
    }
}