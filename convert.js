const { Remarkable } = require('remarkable');
const overrideRules = require('./rules');
const output = require('./output');
const fs = require('fs');
const path = require('path');

var md = new Remarkable();

let resultJSON = {
    compass: [
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

let sectionCounter = 1;

function addSection(section){
    
    if (!section || typeof section !== 'object') return;
    section.id = sectionCounter++;

    resultJSON.compass[0].sections.push(section);
}

function addSubtopic(subtopic){

    if (!subtopic || typeof subtopic !== 'object') return;

    refs.currentSection.subtopics.push(subtopic);

}

function addBlock(block){

    if (!block || typeof block !== 'object') return;

    if (refs.currentSubtopic) {
        refs.currentSubtopic.blocks.push(block);
        return;
    }

    if (refs.currentSection){
        refs.currentSubtopic = {
            title: "",
            blocks: [block]
        };
        refs.currentSection.subtopics.push(refs.currentSubtopic);
        return;
    }

    refs.currentSection = {
        id: sectionCounter++,
        title: "",
        intro: "",
        subtopics: []
    };

    addSection(refs.currentSection);

    refs.currentSubtopic = {
        title: "",
        blocks: [block]
    };

    addSubtopic(refs.currentSubtopic);
    
}

overrideRules(md.renderer.rules, addBlock, addSubtopic, addSection, resultJSON, refs);

const inputPath = path.join(__dirname, 'input.md');
const markdown = fs.readFileSync(inputPath, 'utf-8');
md.render(markdown);

output(resultJSON);