import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import { RingLoader } from 'react-spinners';
import io from 'socket.io-client';
import videojs from 'video.js';
import styles from 'video.js/dist/video-js.css';
import 'videojs-youtube';

import Main from '../components/main';

import { Flex, FlexColumn, FlexColumnCenter } from '../components/styled';
import { blue } from '../styles';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      src: '',
      showSpinner: false,
      transcript: false,
    };

    this.player = undefined;
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('message', this.handleMessage);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.src !== this.state.src && this.player) {
      let type;
      if (/youtube/.test(nextState.src)) {
        type = 'video/youtube';
      } else if (/vimeo/.test(nextState.src)) {
        type = 'video/vimeo';
      }
      this.player.src([{ src: nextState.src, type }]);
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
      this.player = undefined;
    }
    this.socket.off('message', this.handleMessage);
    this.socket.close();
  }

  onBlur = (event) => {
    this.setState({
      src: event.target.value,
    });
  };

  onKeyDown = (event) => {
    if (event.keyCode !== 13) {
      return;
    }
    this.setState({
      src: this.input.value,
    });
  };

  setupPlayer = (node) => {
    const { src } = this.state;
    let type;
    if (/youtube/.test(src)) {
      type = 'video/youtube';
    } else if (/vimeo/.test(src)) {
      type = 'video/vimeo';
    }
    if (this.player) {
      return;
    }
    const options = {
      fluid: true,
      autoplay: false,
      controls: true,
      sources: [{ src, type }],
    };
    this.player = videojs(node, options);
  };

  handleMessage = (message) => {
    if (!message.results) {
      toast.error('A problem occurred while transcribing video');
      return;
    }
    let transcript = '';
    if (!Array.isArray(message.results)) {
      toast.error('A problem occurred while transcribing video');
      return;
    }
    message.results.forEach((obj) => {
      transcript = `${transcript} ${obj.alternatives[0].transcript}`;
    });
    this.setState({
      showSpinner: false,
      transcript,
    });
  };

  render() {
    const {
      src,
      showSpinner,
      transcript,
    } = this.state;

    return (
      <Main>
        <FlexColumnCenter>
          <ToastContainer />
          <style>
            {styles}
          </style>
          <Flex
            css='width: 100%;'
          >
            <img
              src='/static/Maquette PROTO top-left.png'
              alt=''
            />
            <img
              src='/static/Maquette PROTO top-center.png'
              alt=''
              css='
                flex-grow: 100;
              '
            />
            <img
              src='/static/Maquette PROTO top-right.png'
              alt=''
            />
          </Flex>
          <span
            css='
              margin-top: 50px;
              color: red;
              font-weight: bold;
            '
          >
            DESCRIPTION
          </span>
          <span
            css={`
              color: ${blue};
              font-weight: bold;
              margin-top: 50px;
            `
            }
          >
            URL de votre pitch vidéo (youtube)
          </span>
          <input
            type='url'
            name='pitch'
            css='
              margin-top: 50px;
              width: 550px;
              border: 0;
              text-align: center;
              font-size: 21px;
            '
            placeholder='https://www.youtube.com/watch?v=RE2IoW2MZV4'
            onBlur={this.onBlur}
            onKeyDown={this.onKeyDown}
            ref={(node) => { this.input = node; }}
          />
          <hr
            css={`
              display: block;
              height: 1px;
              border: 0;
              border-top: 4px solid ${blue};
              margin: 1em 0;
              padding: 0; 
              width: 300px;
            `}
          />
          {
            src && (
              <Flex>
                <div
                  css='
                    width: 810px;
                    height: 455px;
                  '
                >
                  <div data-vjs-player>
                    { // eslint-disable-next-line jsx-a11y/media-has-caption
                    }<video
                      ref={node => this.setupPlayer(node)}
                      className='video-js'
                    />
                  </div>
                </div>
                <FlexColumnCenter
                  css='
                    justify-content: space-around;
                    margin-left: 20px;
                  '
                >
                  <button
                    css='
                      background-color: clear;
                      border: 0;
                      cursor: pointer;
                    '
                    onClick={() => {
                      this.player.play();
                    }}
                  >
                    <img
                      src='/static/watchVideo.png'
                      alt='Watch video'
                    />
                  </button>
                  <button
                    css='
                      background-color: clear;
                      border: 0;
                      cursor: pointer;
                    '
                    onClick={() => {
                      this.socket.emit('message', this.input.value);
                      this.setState({
                        showSpinner: true,
                        transcript: false,
                      });
                    }}
                  >
                    <img
                      src='/static/readVideo.png'
                      alt='Read video'
                    />
                  </button>
                </FlexColumnCenter>
              </Flex>
            )
          }
          <FlexColumn
            css='
              width: 640px;
              height: 640px;
              justify-content: flex-start;
              align-items: center;
              margin-top: 20px;
            '
          >
            { showSpinner &&
            <RingLoader
              color='#123abc'
              loading
            /> /* <Spinner name='line-scale' /> */ }
            { transcript && <div>{transcript}</div> }
          </FlexColumn>
        </FlexColumnCenter>
        <script src='/static/video.js' />
      </Main>
    );
  }
}

export default Index;
