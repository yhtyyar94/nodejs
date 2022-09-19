import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

const ReactShare = () => {
  return (
    <div>
      <FacebookShareButton
        quote="hello"
        url="https://boldmedya.com/2022/07/29/surgun-profesor-mehmet-atesin-hikayesi-teknigi-tip-literaturune-girdi-avrupada-kalp-cerrahligina-baslayacak/"
      >
        <FacebookIcon />
      </FacebookShareButton>
      <TwitterShareButton
        title="hello world"
        url="https://boldmedya.com/2022/07/29/surgun-profesor-mehmet-atesin-hikayesi-teknigi-tip-literaturune-girdi-avrupada-kalp-cerrahligina-baslayacak/"
      >
        <TwitterIcon />
      </TwitterShareButton>
    </div>
  );
};

export default ReactShare;
