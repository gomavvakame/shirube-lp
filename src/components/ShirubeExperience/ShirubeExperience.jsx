import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ReactGA from 'react-ga4';
import { scenes } from './sceneData';
import './ShirubeExperience.css';

const ShirubeExperience = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [darkOverlayOpacity, setDarkOverlayOpacity] = useState(0);
  const [modalOpacity, setModalOpacity] = useState(0);
  const [modalScale, setModalScale] = useState(0.96);
  const [dissolveOpacity, setDissolveOpacity] = useState(0);
  const [chevronVisible, setChevronVisible] = useState(false);
  const [swipeTranslateY, setSwipeTranslateY] = useState(0);
  const [swipeOverlayDim, setSwipeOverlayDim] = useState(0);
  const [swipeTransition, setSwipeTransition] = useState('none');
  const [needsScroll, setNeedsScroll] = useState(false);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [scrollCheckDone, setScrollCheckDone] = useState(false);

  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const modalRef = useRef(null);
  const chevronTimerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const savedScrollYRef = useRef(0);
  const closedViaPopstateRef = useRef(false);
  const touchStartRef = useRef(null);
  const swipingRef = useRef(false);
  const phaseRef = useRef('idle');
  const currentSceneRef = useRef(0);

  phaseRef.current = phase;
  currentSceneRef.current = currentScene;

  const checkScrollability = useCallback(() => {
    const container = contentRef.current;
    if (!container) return;
    const scrollable = container.scrollHeight > container.clientHeight;
    setNeedsScroll(scrollable);
    setScrollCheckDone(true);
    if (!scrollable) {
      if (chevronTimerRef.current) clearTimeout(chevronTimerRef.current);
      chevronTimerRef.current = setTimeout(() => setChevronVisible(true), 2000);
    }
  }, []);

  const initChevronForScene = useCallback(() => {
    setChevronVisible(false);
    setHasReachedBottom(false);
    setIsAtBottom(false);
    setScrollCheckDone(false);
    if (chevronTimerRef.current) clearTimeout(chevronTimerRef.current);
    requestAnimationFrame(() => {
      checkScrollability();
    });
  }, [checkScrollability]);

  const lockScroll = useCallback(() => {
    savedScrollYRef.current = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollYRef.current}px`;
    document.body.style.width = '100%';
  }, []);

  const sectionRef = useRef(null);

  const unlockScroll = useCallback(() => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    // First restore to saved position so DOM layout is correct
    window.scrollTo(0, savedScrollYRef.current);
    // Then jump to center the section in viewport
    requestAnimationFrame(() => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionCenter = window.scrollY + rect.top + rect.height / 2;
        const targetY = sectionCenter - window.innerHeight / 2;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'instant' });
      }
    });
  }, []);

  const executeClose = useCallback(() => {
    if (phaseRef.current !== 'open') return;
    setPhase('closing');
    setChevronVisible(false);
    if (chevronTimerRef.current) clearTimeout(chevronTimerRef.current);

    ReactGA.event({ category: 'ShirubeExperience', action: 'shirube_experience_close', label: `closed_at_scene_${currentSceneRef.current}`, value: currentSceneRef.current });

    // t=0: Modal begins fading out (800ms).
    // Unlock scroll now — dark overlay + modal still fully cover LP.
    setModalOpacity(0);
    setModalScale(0.96);
    unlockScroll();

    // t=800ms: Modal faded. Begin LP reveal.
    setTimeout(() => {
      document.body.classList.remove('shirube-exp-warp-active');
      document.body.classList.add('shirube-exp-warp-closing');
      setDarkOverlayOpacity(0);
    }, 800);

    // t=1600ms: Everything complete. Unmount.
    setTimeout(() => {
      document.body.classList.remove('shirube-exp-warp-closing');
      setIsOpen(false);
      setPhase('idle');
      triggerRef.current?.focus();
    }, 1600);
  }, [unlockScroll]);

  const closeModal = useCallback((fromPopstate = false) => {
    if (fromPopstate) {
      closedViaPopstateRef.current = true;
      executeClose();
    } else {
      window.history.back();
    }
  }, [executeClose]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setCurrentScene(0);
    setPhase('opening');
    setDarkOverlayOpacity(0);
    setModalOpacity(0);
    setModalScale(0.96);
    setSwipeTranslateY(0);
    setSwipeOverlayDim(0);
    setSwipeTransition('none');
    setChevronVisible(false);
    setNeedsScroll(false);
    setHasReachedBottom(false);
    closedViaPopstateRef.current = false;
    if (chevronTimerRef.current) clearTimeout(chevronTimerRef.current);
    lockScroll();
    document.body.classList.add('shirube-exp-warp-active');

    window.history.pushState({ shirubeModalOpen: true }, '');

    ReactGA.event({ category: 'ShirubeExperience', action: 'shirube_experience_open' });
    ReactGA.event({ category: 'ShirubeExperience', action: 'shirube_experience_scene_view', label: 'scene_0', value: 0 });

    requestAnimationFrame(() => {
      setDarkOverlayOpacity(1);
    });

    setTimeout(() => {
      setModalOpacity(1);
      setModalScale(1);
    }, 1200);

    setTimeout(() => {
      setPhase('open');
      initChevronForScene();
    }, 2400);
  }, [initChevronForScene, lockScroll]);

  const handleNextScene = useCallback(() => {
    if (phase !== 'open' || currentScene >= 2) return;
    setPhase('dissolving');
    setChevronVisible(false);
    if (chevronTimerRef.current) clearTimeout(chevronTimerRef.current);

    setDissolveOpacity(1);

    setTimeout(() => {
      const next = currentScene + 1;
      setCurrentScene(next);
      if (contentRef.current) contentRef.current.scrollTop = 0;

      // Reset scroll/chevron state immediately with content switch
      setHasReachedBottom(false);
      setIsAtBottom(false);
      setScrollCheckDone(false);

      ReactGA.event({ category: 'ShirubeExperience', action: 'shirube_experience_scene_view', label: `scene_${next}`, value: next });
      if (next === 2) {
        ReactGA.event({ category: 'ShirubeExperience', action: 'shirube_experience_complete' });
      }

      // Check scrollability after new content renders
      requestAnimationFrame(() => {
        checkScrollability();
      });
    }, 1000);

    setTimeout(() => {
      setDissolveOpacity(0);
    }, 1000);

    setTimeout(() => {
      setPhase('open');
    }, 2000);
  }, [phase, currentScene, checkScrollability]);

  // Scroll monitoring for bottom detection
  useEffect(() => {
    if (!isOpen || phase !== 'open') return;
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrolledToBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 8;
      setIsAtBottom(scrolledToBottom);
      if (scrolledToBottom) {
        setHasReachedBottom(true);
        setChevronVisible(true);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isOpen, phase, currentScene]);

  // Resize re-check
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, checkScrollability]);

  // Popstate listener
  useEffect(() => {
    if (!isOpen) return;
    const handlePopstate = () => {
      if (phaseRef.current !== 'idle') {
        closeModal(true);
      }
    };
    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [isOpen, closeModal]);

  // Keyboard (Esc + focus trap)
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        closeModal(false);
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeModal]);

  // Swipe down to close
  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;

    const onTouchStart = (e) => {
      if (phaseRef.current !== 'open') return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      swipingRef.current = false;
      setSwipeTransition('none');
    };

    const onTouchMove = (e) => {
      if (!touchStartRef.current || phaseRef.current !== 'open') return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;

      if (!swipingRef.current) {
        if (Math.abs(dx) > Math.abs(dy)) {
          touchStartRef.current = null;
          return;
        }
        if (dy < 0) return;
        const content = contentRef.current;
        if (content && content.scrollTop > 0) return;
        if (dy > 10) {
          swipingRef.current = true;
        }
      }

      if (swipingRef.current && dy > 0) {
        e.preventDefault();
        setSwipeTranslateY(dy);
        setSwipeOverlayDim(Math.min(dy / 400, 0.7));
      }
    };

    const onTouchEnd = () => {
      if (!swipingRef.current) {
        touchStartRef.current = null;
        return;
      }
      const dy = swipeTranslateY;
      if (dy >= 120) {
        closeModal(false);
      } else {
        setSwipeTransition('transform 0.3s ease, opacity 0.3s ease');
        setSwipeTranslateY(0);
        setSwipeOverlayDim(0);
        setTimeout(() => setSwipeTransition('none'), 300);
      }
      touchStartRef.current = null;
      swipingRef.current = false;
    };

    modal.addEventListener('touchstart', onTouchStart, { passive: true });
    modal.addEventListener('touchmove', onTouchMove, { passive: false });
    modal.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      modal.removeEventListener('touchstart', onTouchStart);
      modal.removeEventListener('touchmove', onTouchMove);
      modal.removeEventListener('touchend', onTouchEnd);
    };
  }, [isOpen, swipeTranslateY, closeModal]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (chevronTimerRef.current) clearTimeout(chevronTimerRef.current);
    };
  }, []);

  const scene = scenes[currentScene];
  const titleId = `shirube-exp-title-${scene.id}`;

  const showFadeMask = needsScroll && !isAtBottom;

  const modalTransform = swipeTranslateY > 0
    ? `scale(${modalScale}) translateY(${swipeTranslateY}px)`
    : `scale(${modalScale})`;

  const modalTransitionStyle = (() => {
    if (swipeTranslateY > 0) return swipeTransition;
    if (phase === 'closing')
      return 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)';
    return 'opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1) 1200ms, transform 1200ms cubic-bezier(0.22, 1, 0.36, 1) 1200ms';
  })();

  const modal = isOpen
    ? createPortal(
        <>
          <div
            className="shirube-exp-dark-overlay"
            style={{
              opacity: darkOverlayOpacity * (1 - swipeOverlayDim),
              transition: swipeTranslateY > 0
                ? swipeTransition
                : phase === 'closing'
                  ? 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'opacity 1200ms cubic-bezier(0.7, 0, 0.84, 0)',
            }}
          />
          <div
            ref={modalRef}
            className="shirube-exp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={() => { if (phase === 'open') closeModal(false); }}
            style={{
              opacity: modalOpacity,
              transform: modalTransform,
              transition: modalTransitionStyle,
              touchAction: 'pan-y',
            }}
          >
            <div
              className="shirube-exp-bg"
              style={{ backgroundImage: `url(${scene.bgImage})` }}
            />
            <div className="shirube-exp-bg-overlay" />

            <div
              className="shirube-exp-dissolve"
              style={{
                opacity: dissolveOpacity,
                transition: 'opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />

            <div
              ref={contentRef}
              className="shirube-exp-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id={titleId} className="shirube-exp-scene-title">
                {scene.title}
              </h2>
              <div className="shirube-exp-body">
                {scene.body.map((line, i) =>
                  line === '' ? (
                    <div key={i} className="shirube-exp-empty-line" />
                  ) : (
                    <p key={i}>{line}</p>
                  )
                )}
              </div>
            </div>

            <div
              className="shirube-exp-fade-mask"
              style={{ opacity: showFadeMask ? 1 : 0 }}
              aria-hidden="true"
            />

            {currentScene < 2 && (
              <button
                ref={firstFocusableRef}
                className={`shirube-exp-chevron ${chevronVisible && scrollCheckDone ? 'visible' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextScene();
                }}
                aria-label="次のシーンへ"
              >
                <svg width="32" height="16" viewBox="0 0 32 16" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2,2 16,14 30,2" />
                </svg>
              </button>
            )}
          </div>
        </>,
        document.body
      )
    : null;

  return (
    <>
      <section ref={sectionRef} className="shirube-exp-section">
        <p className="shirube-exp-lead">少しだけ覗いてみてください。</p>
        <div className="shirube-exp-trigger-wrap">
          <button
            ref={triggerRef}
            className="shirube-exp-trigger"
            onClick={handleOpen}
            aria-label="標で起きること、体験ポップアップを開く"
          >
            {'　標で起きること　'}
          </button>
          <span className="shirube-exp-trigger-line" aria-hidden="true" />
        </div>
      </section>
      {modal}
    </>
  );
};

export default ShirubeExperience;
