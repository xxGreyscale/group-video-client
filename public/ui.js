
// join channel modal
$( "#join-channel" ).click(function( event ) {
  var agoraAppId = '898976a0d4b5494ca337f25e7a534a7e';
  var pathName = window.location.pathname.split('/')
  var channelName = window.location.search.replace('?channel=', '')

  initClientAndJoinChannel(agoraAppId, channelName);
  $("#modalForm").modal("hide");
});

// UI buttons
function enableUiControls(localStream) {

  $("#mic-btn").prop("disabled", false);
  $("#video-btn").prop("disabled", false);
  $("#screen-share-btn").prop("disabled", false);
  $("#exit-btn").prop("disabled", false);

  $("#mic-btn").click(function(){
    toggleMic(localStream);
  });

  $("#video-btn").click(function(){
    toggleVideo(localStream);
  });

  $("#screen-share-btn").click(function(){
    toggleScreenShareBtn(); // set screen share button icon
    $("#screen-share-btn").prop("disabled",true); // disable the button on click
    if(screenShareActive){
      stopScreenShare();
    } else {
      var agoraAppId = '898976a0d4b5494ca337f25e7a534a7e';
      var channelName = window.location.search.replace('?channel=', '')
      initScreenShare(agoraAppId, channelName); 
    }
  });

  $("#exit-btn").click(function(){
    console.log("so sad to see you leave the channel");
    leaveChannel(); 
  });

  // keyboard listeners 
  $(document).keypress(function(e) {
    switch (e.key) {
      case "m":
        console.log("squick toggle the mic");
        toggleMic(localStream);
        break;
      case "v":
        console.log("quick toggle the video");
        toggleVideo(localStream);
        break; 
      case "s":
        console.log("initializing screen share");
        toggleScreenShareBtn(); // set screen share button icon
        $("#screen-share-btn").prop("disabled",true); // disable the button on click
        if(screenShareActive){
          stopScreenShare();
        } else {
          initScreenShare(); 
        }
        break;  
      case "q":
        console.log("so sad to see you quit the channel");
        leaveChannel(); 
        break;   
      default:  // do nothing
    }

    // (for testing) 
    if(e.key === "r") { 
      window.history.back(); // quick reset
    }
  });
}

function toggleBtn(btn){
  btn.toggleClass('btn-dark').toggleClass('btn-danger');
}

function toggleScreenShareBtn() {
  $('#screen-share-btn').toggleClass('btn-danger');
  $('#screen-share-icon').toggleClass('fa-share-square').toggleClass('fa-times-circle');
}

function toggleVisibility(elementID, visible) {
  if (visible) {
    $(elementID).attr("style", "display:block");
  } else {
    $(elementID).attr("style", "display:none");
  }
}


function toggleMic(localStream) {
    if ($("#mic-btn svg").hasClass('feather feather-mic')) {
      $("#mic-btn svg.feather.feather-mic").replaceWith(feather.icons['mic-off'].toSvg());
      $("#mic-btn svg.feather.feather-mic").addClass("my-2")
      $('span.mic-btn-text').text("-----")
      localStream.muteAudio(); // mute the local mic
      toggleVisibility("#mute-overlay", true); // show the muted mic icon
    } else {
      $("#mic-btn svg.feather.feather-mic-off").replaceWith(feather.icons['mic'].toSvg());
      $("#mic-btn svg.feather.feather-mic-off").addClass("my-2")
      $('span.mic-btn-text').text(".......")
      localStream.unmuteAudio(); // enable the local mic
      toggleVisibility("#mute-overlay", false); // hide the muted mic icon
    }

}

function toggleVideo(localStream) {
  if ($("#video-btn svg").hasClass('feather feather-video')) {
    $("#video-btn svg.feather.feather-video").replaceWith(feather.icons['video-off'].toSvg());
    $("#video-btn svg.feather.feather-video-off").addClass("my-2")
    $('span.video-btn-text').text("Start Video")
    localStream.muteVideo(); // enable the local video
    toggleVisibility("#no-local-video", true); // hide the user icon when video is enabled    
  } else {
    $("#video-btn svg.feather.feather-video-off").replaceWith(feather.icons['video'].toSvg());
    $("#video-btn svg.feather.feather-video").addClass("my-2")
    localStream.unmuteVideo(); // disable the local video
    toggleVisibility("#no-local-video", false); // show the user icon when video is disabled
    $('span.video-btn-text').text("Stop Video")
  }
}