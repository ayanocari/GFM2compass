const { Remarkable } = require('remarkable');
const overrideRules = require('./rules');
const output = require('./output');
const fs = require('fs');

var md = new Remarkable();

let resultJSON = {
    name: [
        {
            topic: "",
            sections: []
        }
    ]
};

const refs = {
    currentSection: null,
    currentSubtopic: null
};

let currentSection = refs.currentSection;
let currentSubtopic = refs.currentSubtopic;

function addBlock(location, block){
    if (location) {
        location.push(block);
        return;
    }

    if (currentSection){
        currentSection.subtopics.push(block);
        return;
    }

    resultJSON.name[0].sections.push(block);
}

overrideRules(md.renderer.rules, addBlock, resultJSON, refs);

const markdown = fs.readFileSync('input.md', 'utf-8');
md.render(markdown);

output(resultJSON);