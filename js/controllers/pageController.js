const PageController = {
   
    pages: {},

    register(pageName, initFunction) {
        this.pages[pageName] = initFunction;
    },

    init() {
        const pagePath = window.location.pathname;
        const pageName = pagePath.split('/').pop() || 'index.html';

        if (this.pages[pageName]) {
            this.pages[pageName]();
        }
    }
};