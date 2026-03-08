const { Remarkable } = require('remarkable');

var md = new Remarkable();

var rules = md.renderer.rules;

let name = null;

let output = {
    name: [
        {
            topic: "",
            sections: []
        }
    ]
};

let currentSection = null;
let currentSubtopic = null;

const keep = [
        "heading_open",
        "heading_close",
        "paragraph_open",
        "paragraph_close",
        "code",
        "fence"
    ];

for (const ruleName in rules){

    if (!keep.includes(ruleName)){
        rules[ruleName] = () => '';
    }

}

function addBlock(location, block){
    if (location) {
        location.push(block);
        return;
    }

    if (currentSection){
        currentSection.subtopics.push(block);
        return;
    }

    output.name[0].sections.push(block);
}

rules.heading_open = function(tokens, idx)
{
    const level = tokens[idx].hLevel;
    const title = tokens[idx+1].content;

    if (level === 1){
        output.name[0].topic = title;
        currentSection = null;
        curretnSubtopic = null;
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

rules.heading_close = function (tokens, idx)
{
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

rules.paragraph_close = function(tokens, idx)
{
    return '';
}

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

const fs = require('fs');
const markdown = fs.readFileSync('input.md', 'utf-8');

md.render(markdown);

console.log(JSON.stringify(output, null, 2));

