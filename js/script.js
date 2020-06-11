function SmoothScroll(

  args = {
    inner: '.smoooth-inner', //Your content wrapper
    outer: '.smoooth', //The inner scrollable content
    transition: 'cubic-bezier(.05,.50,.45,1) 2.5s', //Easing while scrolling & timing. This is CSS.
    transitionEnd: 'cubic-bezier(.15,.68,.44,1.26) 1s', //Easing when reaching the end of scrolling & timing. This is CSS.
    scrollRatio: .75, //Scroll speed, higher is faster
    touchRatio: 1, //Scroll speed on mobile devices
    skewRatio: 0, //Skew effect on content, set it to zero to disable it
    touchSkewRatio: .01,//Skew effect on mobile because it has to be calculated differently
    scrollProgress: true,
    scrollProgressColor: '#dedede',
    scrollProgressWidth: '0.4vh'
  }) {

  let head = document.querySelector('head')

  let styles = document.createElement('style')
  styles.innerHTML = `
  html, body { overflow: hidden; width: 100vw; height: 100vh; } ${args.outer} { overflow: hidden; }
  .smoooth-scroll-progress { position: fixed; right: 60vw; top: 0; background: ${args.scrollProgressColor}; width: ${args.scrollProgressWidth}; transition: ${args.transition}; z-index: 999; border-radius: 0 0 2vh 2vh;}
  `
  head.appendChild(styles)


  let body, scrollProgress, inner, outer, position, innerY, windowY, touchStartPos, touchStart, touchEnd, touchMove, touchDelta, skew

  inner = document.querySelector(args.inner)
  outer = document.querySelector(args.outer)
  position = 0
  innerY = inner.clientHeight
  windowY = window.innerHeight
  skew = 0

  window.addEventListener('resize', function() {
    innerY = inner.clientHeight
    windowY = window.innerHeight
  })

  if(args.scrollProgress) {
    body = document.querySelector('body')
    scrollProgress = document.createElement('div')
    scrollProgress.classList.add('smoooth-scroll-progress')
    body.appendChild(scrollProgress)
  }

  function translateContent() {
    if (position <= -(innerY - windowY)) {
      position = -(innerY - windowY)
      inner.style.transition = args.transitionEnd
      inner.style.transform = `translate3d(0,${position}px,0)`
    } else if (position >= 0) {
      position = 0
      inner.style.transition = args.transitionEnd
      inner.style.transform = `translate3d(0,${position}px,0)`
    } else {
      inner.style.transition = args.transition
      inner.style.transform = `translate3d(0,${position}px,0)skewY(${skew}deg)`
    }
    if ( args.scrollProgress ) {
      scrollProgress.style.height = `${ -position / (innerY - windowY) * windowY }px`
    }
    requestAnimationFrame(translateContent)
  }

  function onScroll(e) {
    position -= e.deltaY * args.scrollRatio
    skew = e.deltaY * args.skewRatio
  }


  window.addEventListener('wheel', function(e) {
    onScroll(e)
  }, { passive : true })


  window.addEventListener(
    "touchstart",
    function(e) {
      touchStart = e.touches[0].clientY;
      touchStartPos = position
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    function(e) {
      touchMove = e.touches[0].clientY;
      touchDelta = touchStart - touchMove;
      position = touchStartPos - touchDelta*args.touchRatio;
      skew = touchDelta * args.touchSkewRatio
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    function(e) {
      touchStartPos = position;
      touchMove = 0;
      skew = 0;
    },
    { passive: true }
  );

  translateContent()

}

document.addEventListener('DOMContentLoaded', SmoothScroll());



/*window.onload = function () {
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);
    document.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
            disabledEvent(e);
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
            disabledEvent(e);
        }
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            disabledEvent(e);
        }
        if (e.ctrlKey && e.keyCode == 85) {
            disabledEvent(e);
        }
        if (event.keyCode == 123) {
            disabledEvent(e);
        }
    }, false);
    function disabledEvent(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
        e.preventDefault();
        return false;
    }
}*/
