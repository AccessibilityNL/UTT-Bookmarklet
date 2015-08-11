define(['UTT/components/Reporter'],
function (Reporter) {

    let categories = [];

    let reporter = function(config, i18n, render) {
        render(Reporter, {
            categories,
            i18n: i18n
        });
    };

    reporter.addResult = function (categoryBase, assertion) {
        let category = categories
        .find((elm) => elm.title === categoryBase.title);

        if (!category) {
            category = Object.assign({assertions: []}, categoryBase);
            categories.push(category);
        }
        category.assertions.push(assertion);
    };

    return reporter;

});