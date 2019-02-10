function initiateVoteSession(done) {
    $.get('http://writingstyle.ddns.net/surveyQuery', function(data) {
        done(parseVoteResponse(data));
    });
}

function parseVoteResponse(data) {
    let components = data.split(';');
    if (components[0] === 'done') {
        return null;
    } else {
        var wordInfo = {
            wordId: components[0],
            word: components[1],
            possibleDefinitions: components.slice(2)
        };

        return wordInfo;
    }
}

function titleCase(word) {
    if (word.length < 2) {
        return word;
    }
    return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
}

function handleWordSelected(event) {
    let sender = event.target;
    let word = $(sender).text().toUpperCase();
        
    vote(word, curRound);
}

function vote(word, round) {
    let voteUrl = `http://writingstyle.ddns.net/surveyQuery?wordid=${round.wordId}&word=${round.word}&choice=${word}`;
    $.get(voteUrl, function(data) {
        let roundInfo = parseVoteResponse(data);
        if (roundInfo) {
            if (roundInfo.possibleDefinitions.length < 2) {
                if (roundInfo.possibleDefinitions.length == 0) {
                    vote('', roundInfo);
                } else {
                    vote(roundInfo.possibleDefinitions[0], roundInfo);
                }
            } else {
                loadRound(roundInfo);
            }
        } else {
            displayEnd();
        }
    })
}

function displayEnd() {
    $('#word-option-container').empty();
    $('#head-word').text('Done');
    $('#head-word').css('font-style', 'italic');
}

function loadRound(round) {
    curRound = round;
    // remove all the word buttons from the container
    $('#word-option-container').empty();

    $('#head-word').text(titleCase(round.word));
    for (let altWord of round.possibleDefinitions) {
        var $altWordBtn = $('<button />', {
            'class': 'btn btn-light alt-word-button',
            text: titleCase(altWord),
            click: handleWordSelected,
            type: 'button',
        });

        $('#word-option-container').append($altWordBtn);
    }
}

$(document).ready(function() {
    initiateVoteSession(function(round) {
        loadRound(round);
    });
});