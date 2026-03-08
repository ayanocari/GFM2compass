function overrideRules(rules, addBlock, output, refs) {
    
    let currentSection = refs.currentSection;
    let currentSubtopic = refs.currentSubtopic;

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
            output.name[0].topic = title;
            currentSection = null;
            currentSubtopic = null;
            return '';
        }

        if (level === 2){
            currentSection = {
                id: "",
                title: title,
                subtopics: []
            };

            addBlock(output.name[0].sections, currentSection);
            currentSubtopic = null;
            return '';
        }

        if (level === 3){
            currentSubtopic = {
                title: title, 
                blocks: []
            };

            addBlock(currentSection ? currentSection.subtopics : null, currentSubtopic);
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

        addBlock(currentSubtopic ? currentSubtopic.blocks : null, block);
        return '';
    };

    rules.code = function(tokens, idx)
    {
        block = {
            type: "code",
            value: tokens[idx].content,
            codeBlock: "single"
        }

        addBlock(currentSubtopic ? currentSubtopic.blocks : null, block);
        return '';
    };

    rules.fence = function(tokens, idx, options, env, instance)
    {    
        block = {
            type: "code",
            value: tokens[idx].content,
            codeBlock: "multi"
        }

        addBlock(currentSubtopic ? currentSubtopic.blocks : null, block);
        return '';
    };
}

module.exports = overrideRules;