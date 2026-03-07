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

                output.name[0].sections.push(currentSection);
                break;
        
            case 2:
                
                currentSubtopic = {
                    title: tokens[idx+1].content,
                    blocks: []
                }
                
                currentSection.subtopics.push(currentSubtopic);
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

    currentSubtopic.blocks.push(block);
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

    currentSubtopic.blocks.push(block);
    return '';
};

rules.fence = function(tokens, idx, options, env, instance)
{    
    block = {
        type: "code",
        value: tokens[idx].content,
        codeBlock: "multi"
    }

    currentSubtopic.blocks.push(block);
    return '';
};




