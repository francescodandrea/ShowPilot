//sequence player
/*
    ENCODINGS
        0 - complete
            every timeout and the explicit 3 signal values
                local sends a request for each triggered action
                at the moment it needs to be played

        1 - fast
            every timeout references a local scene
                local sends a request for each triggered action

        2 - serverside
            every timeout references a server scene
                local sends the 1-encoded sequence
                once sent it's the server to execute the sequence

        3 - remote
            reference to a server sequence
                local sends the sequence name only
                once sent it's the server to execute the sequence
*/

var testseq = {"meta": {"name": "Intro", "show": "sgt2022", "author": "user1", "encoding": 3},"seq": {"0": "a", "1": "s"}};


function play(){
    //document.querySelector("#live > div > input").value
    let encoding=0;
    let seq=testseq;

    switch (encoding) {
        case 0:
            complete_e(seq);
            break;
    }
}

function complete_e(seq){

}