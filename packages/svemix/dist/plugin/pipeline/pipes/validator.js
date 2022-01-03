const ValidatorPipe = async function (args) {
    let { config, doc } = args;
    if (config.prerenderAll) {
        doc.prerender = 'all';
    }
    // Only check for files within routes
    if (!doc.filename || !doc.filename.includes(config.routes)) {
        return {
            config,
            doc,
            continue: false,
        };
    }
    if (!doc.filename.endsWith('.svelte')) {
        return {
            config,
            doc,
            continue: false,
        };
    }
    return {
        config,
        doc,
        continue: true,
    };
};
export default ValidatorPipe;
