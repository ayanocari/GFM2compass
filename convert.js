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

                block = {
                    id: "",
                    title: "",
                    intro: "",
                    subtopics: []
                }
                block.title = tokens[idx+1].content;
                output.name[0].sections.push(block);
                break;
        
            case 2:
                
                block = {
                    title: "",
                    blocks: []
                }
                block.title = tokens[idx+1].content;
                output.name[0].currentSection.subtopics.push(block);
                break;

            default:
                break;
        }
    }
    level++;

}

rules.code = function(tokens, idx)
{
    block = {
        type: "code",
        value: tokens[idx].content,
        codeBlock: "single"
    }

    output.name[0].currentSection.currentSubtopic.push(block);
    
    return '';
};

rules.fence = function(tokens, idx, options, env, instance)
{    
    block = {
        type: "code",
        value: tokens[idx].content,
        codeBlock: "multi"
    }

    output.name[0].currentSection.currentSubtopic.push(block);
    
    return '';
};




