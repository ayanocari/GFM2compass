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
let level = 0;

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
    if (level == 0){
        output.name[0].topic = tokens[idx+1].content;
    } else {

        switch (level) 
        {
            case 1:

                currentSection = {
                    id: "",
                    title: tokens[idx+1].content,
                    intro: "",
                    subtopics: []
                }

                addBlock(output.name[0].sections, currentSection);
                break;
        
            case 2:
                
                currentSubtopic = {
                    title: tokens[idx+1].content,
                    blocks: []
                }

                addBlock(currentSection ? currentSection.subtopics : null, currentSubtopic);
                break;

            default:
                break;
        }
    }
    level++;
    return '';
};

rules.heading_close = function (tokens, idx)
{
    level --;
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

