function overrideRules(rules, addBlock, addSubtopic, addSection, output, refs) {

    const keep = [
        "heading_open",
        "paragraph_open",
        "code",
        "fence"
    ];

    for (const ruleName in rules){

        if (!keep.includes(ruleName)){
            rules[ruleName] = () => '';
        }

    }

    rules.heading_open = function(tokens, idx)
    {
        const level = tokens[idx].hLevel;
        const title = tokens[idx+1].content;

        if (level === 1){
            output.compass[0].topic = title;
            refs.currentSection = null;
            refs.currentSubtopic = null;
            return '';
        }

        if (level === 2){
            refs.currentSection = {
                id: "",
                title: title,
                intro: "",
                subtopics: []
            };

            addSection(refs.currentSection);
            refs.currentSubtopic = null;
            return '';
        }

        if (level === 3){
            refs.currentSubtopic = {
                title: title, 
                blocks: []
            };

            addSubtopic(refs.currentSubtopic);
            return '';
        }

        return '';
    };

    rules.paragraph_open = function(tokens, idx)
    {
        block = {
            type: "text",
            value: tokens[idx+1].content
        }

        addBlock(block);
        return '';
    };

    rules.code = function(tokens, idx)
    {
        block = {
            type: "code",
            value: tokens[idx].content,
            codeBlock: "single"
        }

        addBlock(block);
        return '';
    };

    rules.fence = function(tokens, idx)
    {    
        block = {
            type: "code",
            value: tokens[idx].content,
            codeBlock: "multi"
        }

        addBlock(block);
        return '';
    };
}

module.exports = overrideRules;