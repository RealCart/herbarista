"use strict";
import {
  isWebp,
  spollers,
  tabs,
  removeClasses,
  bodyLockStatus,
  bodyLockToggle,
  bodyUnlock,
  bodyLock,
  menuInit,
  menuOpen,
  menuClose,
  getDigFormat,
  getDigFromString,
  toggleActiveClass,
} from "./module/functions.js";
import "./module/dynamic_adapt.js";
import "./module/popup.js";
import "./module/select.js";
import "./module/checkout.js";
import Swiper from "swiper";
import {
  Autoplay,
  Navigation,
  Pagination,
  FreeMode,
  EffectFade,
  Mousewheel,
  Thumbs,
} from "swiper/modules";
import noUiSlider from "nouislider";

// import tippy from "tippy.js";
// import Masonry from "masonry-layout";
// import AirDatepicker from "air-datepicker";

window.addEventListener("load", function () {
  isWebp();
  menuInit();
  spollers();
  tabs();
  toggleActiveClass(".your-selector");

  document.querySelectorAll(".tabs__item").forEach((clickedTab) => {
    clickedTab.addEventListener("click", function (e) {
      e.preventDefault();

      const tabsParent = this.closest(".tabs__nav");
      if (tabsParent) {
        tabsParent.querySelectorAll(".tabs__trigger").forEach((trigger) => {
          trigger.classList.remove("is-active");
        });
      }

      const clickedTrigger = this.querySelector(".tabs__trigger");
      clickedTrigger.classList.add("is-active");

      const tabId = clickedTrigger.dataset.tab;
      document.querySelectorAll(".tabs__pane").forEach((pane) => {
        if (pane.id === tabId) {
          pane.classList.add("is-active");
          pane.hidden = false;
        } else {
          pane.classList.remove("is-active");
          pane.hidden = true;
        }
      });

      const pageTitle = document.querySelector(".page-head__title");
      const breadcrumbsLink = document.querySelector(".breadcrumbs__link__m2");
      if (pageTitle) {
        const tabText = clickedTrigger.textContent.trim();
          if (tabText === "Новосибирск") {
            pageTitle.textContent = "Контакты Новосибирск";
            breadcrumbsLink.textContent = "Контакты Новосибирск";
        } else if (tabText === "Москва и МО") {
          pageTitle.textContent = "Контакты Москва и МО";
          breadcrumbsLink.textContent = "Контакты Москва и МО";
        }
      }
    });
  });

  const disableIOSTextFieldZoom = () => {
    if (!isIOS()) {
      return;
    }
    const element = document.querySelector("meta[name=viewport]");
    if (element !== null) {
      let content = element.getAttribute("content");
      let scalePattern = /maximum\-scale=[0-9\.]+/g;
      if (scalePattern.test(content)) {
        content = content.replace(scalePattern, "maximum-scale=1");
      } else {
        content = [content, "maximum-scale=1"].join(", ");
      }
      element.setAttribute("content", content);
    }
  };
  // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885#9039885
  function isIOS() {
    return (
      ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
        navigator.platform
      ) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  }
  disableIOSTextFieldZoom();

  // tippy("[data-tippy-content]", { maxWidth: 230 });

  const HEADER = document.querySelector(".header");
  const USER_BAR = document.querySelector(".user-bar");
  const $md2 = 1023.98;
  // const $md3 = 768;
  const matchMediaMi2 = window.matchMedia(`(min-width: ${$md2}px)`);
  // const matchMediaMi3 = window.matchMedia(`(min-width: ${$md3}px)`);

  // matchMediaMi3.addEventListener("change", () => {});

  matchMediaMi2.addEventListener("change", () => {
    if (document.documentElement.classList.contains("_is-menu-open")) {
      menuClose();
    }
    if (document.documentElement.classList.contains("_is-filters-open")) {
      document.documentElement.classList.remove("_is-filters-open");
    }
  });

  const wrappedTextWidrh = (element) => {
    const { firstChild, lastChild } = element;
    if (!element || !firstChild || !lastChild) return;
    const range = document.createRange();
    range.setStartBefore(firstChild);
    range.setEndAfter(lastChild);
    const { width } = range.getBoundingClientRect();
    element.style.width = width + "px";
    element.style.boxSizing = "content-box";
  };

  const adaptiveFix = () => {
    document.documentElement.style.setProperty("--height-header", `${HEADER.offsetHeight}px`);
    document.documentElement.style.setProperty("--width-page", `${document.body.offsetWidth}px`);
    document.documentElement.style.setProperty("--height-page", `${document.body.offsetHeight}px`);

    if (window.innerWidth < 1024) {
      document.documentElement.style.setProperty("--height-userbar", `${USER_BAR.offsetHeight}px`);
    } else {
      document.documentElement.style.setProperty("--height-userbar", ``);
    }

    if (document.querySelector("[data-adaptive-width]")) {
      document.querySelectorAll("[data-adaptive-width]").forEach((el) => {
        el.style.width = "";
        wrappedTextWidrh(el);
      });
    }
  };
  adaptiveFix();

  const dropdownPosition = (targetElement) => {
    const dropdownElement = targetElement.nextElementSibling;
    const positionContainer = targetElement.parentElement.closest("[data-position-container]");
    const positionContainerBoundingsRight =
      positionContainer.getBoundingClientRect().x + positionContainer.getBoundingClientRect().width;

    targetElement.parentElement.style.setProperty("--position-left", "");
    const dropdownPosition =
      dropdownElement.getBoundingClientRect().x + dropdownElement.getBoundingClientRect().width >
      positionContainerBoundingsRight
        ? `-${Math.round(
            dropdownElement.getBoundingClientRect().x +
              dropdownElement.getBoundingClientRect().width -
              positionContainerBoundingsRight
          )}`
        : 0;
    targetElement.parentElement.style.setProperty("--position-left", `${dropdownPosition}px`);
  };

  const initQuantity = () => {
    const quantities = document.querySelectorAll("[data-quantity]");

    quantities.forEach((quantity) => {
      const quantityInput = quantity.querySelector("[data-quantity-value]");
      const quantityMin = parseInt(quantityInput.dataset.quantityMin);
      const quantityMax = parseInt(quantityInput.dataset.quantityMax);

      const setQuantityValue = (value) => {
        if (value > quantityMax) {
          value = quantityMax;
        }
        if (value < quantityMin) {
          value = quantityMin;

          if (quantity.parentElement.closest(".added")) {
            quantity.parentElement.classList.remove("added");
            quantity.parentElement.querySelector("[data-buy]")?.focus();
          }
        }

        quantityInput.value = value;
      };

      quantity.addEventListener("click", (e) => {
        const targetElement = e.target;
        let quantityValue = parseInt(quantityInput.value);

        if (targetElement.closest("[data-quantity-button]")) {
          e.preventDefault();

          if (targetElement.dataset.quantityButton == "plus") {
            quantityValue++;
          }
          if (targetElement.dataset.quantityButton == "minus") {
            quantityValue--;
          }

          setQuantityValue(quantityValue);
        }
      });

      quantityInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^\d.]/g, "");

        setQuantityValue(e.target.value);
      });
    });
  };

  if (document.querySelector("[data-quantity]")) {
    initQuantity();
  }

  const search = () => {
    const searchWrapper = document.querySelector(".search");
    const searchInput = searchWrapper.querySelector(".search__input");

    searchInput.addEventListener("input", (e) => {
      searchWrapper.classList.toggle("_is-fill", e.target.value.length);
    });

    searchWrapper.addEventListener("click", (e) => {
      const targetElement = e.target;

      if (targetElement.closest(".search__btn_reset")) {
        searchInput.focus();
        searchInput.value = "";
        searchWrapper.classList.remove("_is-fill");
      }
    });
  };
  search();

  const dataAction = (target, attr) => {
    if (target.closest(`[data-${attr}]`)) {
      document.documentElement.classList.toggle(`_is-${attr}-open`);
    }
    if (document.documentElement.closest(`._is-${attr}-open`) && !target.closest(`.${attr}`)) {
      document.documentElement.classList.remove(`_is-${attr}-open`);
    }
  };

  const specsCol = () => {
    const specs = document.querySelector("#specs");
    const specBox = specs.querySelectorAll(".spec__box");
    const specItems = specs.querySelectorAll(".spec__item");

    if (specItems.length > 10 && specBox.length > 1) {
      specs.classList.add("spec_col-2");
    }
  };

  if (document.querySelector(".spec__item")) {
    specsCol();
  }

  // const textArea = document.getElementsByTagName("textarea");
  // for (let i = 0; i < textArea.length; i++) {
  //   textArea[i].setAttribute("style", "height:" + textArea[i].scrollHeight + "px;overflow-y:hidden;");
  //   textArea[i].addEventListener("input", OnInput, false);
  // }
  // function OnInput() {
  //   this.style.height = "auto";
  //   this.style.height = this.scrollHeight + "px";
  // }

  if (document.querySelector(".welcome-slider")) {
    document.querySelector(".welcome-slider").classList.add("_is-init");

    new Swiper(".welcome-slider", {
      modules: [Autoplay, Navigation, EffectFade],
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      watchSlidesProgress: true,
      slideVisibleClass: "welcome-slider__item_visible",
      slideFullyVisibleClass: "welcome-slider__item_shown",
      wrapperClass: "welcome-slider__items",
      slideClass: "welcome-slider__item",
      slideActiveClass: "welcome-slider__item_active",
      slidePrevClass: "welcome-slider__item_prev",
      slideNextClass: "welcome-slider__item_next",
      scrollbar: {
        el: ".welcome-slider__scrollbar",
        dragClass: "welcome-slider__scrollbar-drag",
        draggable: true,
      },
      pagination: {
        clickable: true,
        bulletElement: "button",
        dynamicBullets: true,
        dynamicMainBullets: 4,
        el: ".welcome-slider__pagination",
        lockClass: "_is-lock",
        bulletClass: "welcome-slider__bullet",
        bulletActiveClass: "welcome-slider__bullet_active",
      },
      navigation: {
        prevEl: ".welcome-slider__btn_prev",
        nextEl: ".welcome-slider__btn_next",
        disabledClass: "welcome-slider__btn_disabled",
        lockClass: "_is-lock",
      },
      on: {
        init: (swiper) => {
          swiper.el.classList.toggle("_is-lock", swiper.isLocked);
        },
        resize: (swiper) => {
          swiper.el.classList.toggle("_is-lock", swiper.isLocked);
        },
      },
    });
  }

  if (document.querySelector(".extra-slider")) {
    document.querySelector(".extra-slider").classList.add("_is-init");

    const extraSliderBody = document.querySelector(".extra-slider");
    const responsiveBreakpoint = 1024;
    const matchMediaSlider = window.matchMedia(`(min-width: ${responsiveBreakpoint}px)`);
    let extraSlider;

    function responsiveInit() {
      if (window.innerWidth < responsiveBreakpoint) {
        if (extraSlider) {
          extraSlider.destroy(true, true);
        }

        extraSlider = new Swiper(extraSliderBody, {
          modules: [Navigation, Pagination],
          slidesPerView: "auto",
          spaceBetween: 6,
          wrapperClass: "extra-slider__items",
          slideClass: "extra-slider__item",
          slideActiveClass: "extra-slider__item_active",
          slidePrevClass: "extra-slider__item_prev",
          slideNextClass: "extra-slider__item_next",
          pagination: {
            clickable: true,
            bulletElement: "button",
            el: ".extra-slider__pagination",
            lockClass: "_is-lock",
            bulletClass: "extra-slider__bullet",
            bulletActiveClass: "_is-active",
          },
          navigation: {
            prevEl: ".extra-slider__btn_prev",
            nextEl: ".extra-slider__btn_next",
            disabledClass: "_is-disabled",
            lockClass: "_is-lock",
          },
          on: {
            init: (swiper) => {
              swiper.el.classList.toggle("_is-lock", swiper.isLocked);
            },
            resize: (swiper) => {
              swiper.el.classList.toggle("_is-lock", swiper.isLocked);
            },
          },
        });
      }
      if (window.innerWidth >= responsiveBreakpoint) {
        if (extraSlider) {
          extraSlider.destroy(true, true);
        }

        extraSlider = new Swiper(extraSliderBody, {
          modules: [Autoplay, Navigation, Pagination, EffectFade],
          slidesPerView: 1,
          effect: "fade",
          fadeEffect: {
            crossFade: true,
          },
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          watchSlidesProgress: true,
          slideVisibleClass: "extra-slider__item_visible",
          slideFullyVisibleClass: "extra-slider__item_shown",
          wrapperClass: "extra-slider__items",
          slideClass: "extra-slider__item",
          slideActiveClass: "extra-slider__item_active",
          slidePrevClass: "extra-slider__item_prev",
          slideNextClass: "extra-slider__item_next",
          pagination: {
            clickable: true,
            bulletElement: "button",
            el: ".extra-slider__pagination",
            lockClass: "_is-lock",
            bulletClass: "extra-slider__bullet",
            bulletActiveClass: "extra-slider__bullet_active",
          },
          navigation: {
            prevEl: ".extra-slider__btn_prev",
            nextEl: ".extra-slider__btn_next",
            disabledClass: "extra-slider__btn_disabled",
            lockClass: "_is-lock",
          },
          breakpoints: {
            480: {},
          },
          on: {
            autoplayTimeLeft(swiper, delay, progress) {
              swiper.el.style.setProperty("--width-progress", 1 - progress);
            },
            init: (swiper) => {
              swiper.el.classList.toggle("_is-lock", swiper.isLocked);
            },
            resize: (swiper) => {
              swiper.el.classList.toggle("_is-lock", swiper.isLocked);
            },
          },
        });
      }
    }

    responsiveInit();
    matchMediaSlider.addEventListener("change", () => {
      responsiveSliders();
    });
  }

  if (document.querySelector(".categories__slider")) {
    document.querySelector(".categories__slider").classList.add("_is-init");

    new Swiper(".categories__slider", {
      modules: [Navigation, Pagination],
      slidesPerView: "auto",
      spaceBetween: 6,
      wrapperClass: "categories__items",
      slideClass: "categories__item",
      slideActiveClass: "categories__item_active",
      slidePrevClass: "categories__item_prev",
      slideNextClass: "categories__item_next",
      pagination: {
        clickable: true,
        bulletElement: "button",
        el: ".categories__pagination",
        lockClass: "_is-lock",
        bulletClass: "categories__bullet",
        bulletActiveClass: "_is-active",
      },
      navigation: {
        prevEl: ".categories__btn_prev",
        nextEl: ".categories__btn_next",
        disabledClass: "_is-disabled",
        lockClass: "_is-lock",
      },
      breakpoints: {
        1024: {
          slidesPerView: 5,
        },
        768: {
          slidesPerView: 4,
        },
        576: {
          slidesPerView: 3,
        },
        0: {
          slidesPerView: 2,
        },
      },
      on: {
        init: (swiper) => {
          swiper.el.classList.toggle("_is-lock", swiper.isLocked);
        },
        resize: (swiper) => {
          swiper.el.classList.toggle("_is-lock", swiper.isLocked);
        },
      },
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.delivery-slider');
    if (!sliderContainer) return;
  
    const sliderEl = sliderContainer.querySelector('.delivery-slider__slider');
    if (!sliderEl) return;
  
    sliderEl.classList.add('_is-init');
  
    new Swiper(sliderEl, {
      // если подключён swiper‑bundle.min.js, modules можно убрать
      // modules: [Navigation, Pagination],
  
      slidesPerView: 'auto',
      spaceBetween: 6,
      watchOverflow: true,     // снимает «блокировку», когда слайдов мало
  
      pagination: {
        el: sliderContainer.querySelector('.categories__pagination'),
        clickable: true,
        bulletElement: 'button',
        bulletClass: 'categories__bullet',
        bulletActiveClass: '_is-active',
        lockClass: '_is-lock',
      },
  
      navigation: {
        prevEl: sliderContainer.querySelector('.categories__btn_prev'),
        nextEl: sliderContainer.querySelector('.categories__btn_next'),
        disabledClass: '_is-disabled',
        lockClass: '_is-lock',
      },
  
      breakpoints: {           // адаптив
        1024: { slidesPerView: 5 },
         768: { slidesPerView: 3 },
         480: { slidesPerView: 2 },
           0: { slidesPerView: 1 },
      },
  
      on: {
        init(sw)   { sliderEl.classList.toggle('_is-lock', sw.isLocked); },
        resize(sw) { sliderEl.classList.toggle('_is-lock', sw.isLocked); },
      },
    });
  });
  

  if (document.querySelector(".product__media")) {
    const previewSliderBody = document.querySelector(".product-preview");
    const thumbsSliderBody = document.querySelector(".product-thumbs");
    const previewSlides = document.querySelectorAll(".product-preview__item");
    const responsiveBreakpoint = 480;
    const matchMediaSlider = window.matchMedia(`(min-width: ${responsiveBreakpoint}px)`);
    let previewSlider;
    let thumbsSlider;

    function responsiveSliders() {
      if (window.innerWidth < responsiveBreakpoint) {
        if (previewSlider) {
          previewSliderBody.classList.remove("_is-init");
          previewSlider.destroy(true, true);
        }
        if (thumbsSlider) {
          thumbsSliderBody.classList.remove("_is-init");
          thumbsSlider.destroy(true, true);
        }

        if (previewSlides.length > 1) {
          previewSliderBody.classList.add("_is-init");

          previewSlider = new Swiper(previewSliderBody, {
            modules: [Pagination, EffectFade],
            slidesPerView: 1,
            effect: "fade",
            fadeEffect: {
              crossFade: true,
            },
            wrapperClass: "product-preview__items",
            slideClass: "product-preview__item",
            slideActiveClass: "product-preview__item_active",
            slidePrevClass: "product-preview__item_prev",
            slideNextClass: "product-preview__item_next",
            pagination: {
              clickable: true,
              bulletElement: "button",
              el: ".product-preview__pagination",
              lockClass: "product-preview__pagination_is-lock",
              bulletClass: "product-preview__bullet",
              bulletActiveClass: "product-preview__bullet_active",
            },
            on: {
              init: (swiper) => {
                swiper.el.classList.toggle("_is-lock", swiper.isLocked);
              },
              resize: (swiper) => {
                swiper.el.classList.toggle("_is-lock", swiper.isLocked);
              },
            },
          });
        }
      }
      if (window.innerWidth >= responsiveBreakpoint) {
        if (previewSlider) {
          previewSliderBody.classList.remove("_is-init");
          previewSlider.destroy(true, true);
        }

        if (thumbsSliderBody) {
          thumbsSliderBody.classList.add("_is-init");
          thumbsSlider = new Swiper(thumbsSliderBody, {
            modules: [Navigation, FreeMode, Mousewheel],
            slidesPerView: "auto",
            spaceBetween: 6,
            freeMode: { momentum: false },
            mousewheel: true,
            direction: "vertical",
            wrapperClass: "product-thumbs__items",
            slideClass: "product-thumbs__item",
            slideActiveClass: "product-thumbs__item_active",
            slidePrevClass: "product-thumbs__item_prev",
            slideNextClass: "product-thumbs__item_next",
            navigation: {
              prevEl: ".product-thumbs__btn_prev",
              nextEl: ".product-thumbs__btn_next",
              disabledClass: "product-thumbs__btn_disabled",
              lockClass: "product-thumbs__btn_is-lock",
            },
            on: {
              init: (swiper) => {
                swiper.el.classList.toggle("_is-lock", swiper.isLocked);
              },
              resize: (swiper) => {
                swiper.el.classList.toggle("_is-lock", swiper.isLocked);
              },
            },
          });

          previewSliderBody.classList.add("_is-init");
          previewSlider = new Swiper(previewSliderBody, {
            modules: [EffectFade, Thumbs],
            slidesPerView: 1,
            effect: "fade",
            fadeEffect: {
              crossFade: true,
            },
            wrapperClass: "product-preview__items",
            slideClass: "product-preview__item",
            slideActiveClass: "product-preview__item_active",
            slidePrevClass: "product-preview__item_prev",
            slideNextClass: "product-preview__item_next",
            on: {
              init: (swiper) => {
                swiper.el.classList.toggle("_is-lock", swiper.isLocked);
              },
              resize: (swiper) => {
                swiper.el.classList.toggle("_is-lock", swiper.isLocked);
              },
            },
            thumbs: {
              swiper: thumbsSlider,
            },
          });
        } else if (previewSlides.length > 1) {
          previewSliderBody.classList.add("_is-init");

          previewSlider = new Swiper(previewSliderBody, {
            modules: [EffectFade],
            slidesPerView: 1,
            effect: "fade",
            fadeEffect: {
              crossFade: true,
            },
            wrapperClass: "product-preview__items",
            slideClass: "product-preview__item",
            slideActiveClass: "product-preview__item_active",
            slidePrevClass: "product-preview__item_prev",
            slideNextClass: "product-preview__item_next",
            pagination: {
              clickable: true,
              bulletElement: "button",
              el: ".product-preview__pagination",
              lockClass: "product-preview__pagination_is-lock",
              bulletClass: "product-preview__bullet",
              bulletActiveClass: "product-preview__bullet_active",
            },
            on: {
              init: (swiper) => {
                swiper.el.classList.toggle("_is-lock", swiper.isLocked);
              },
              resize: (swiper) => {
                swiper.el.classList.toggle("_is-lock", swiper.isLocked);
              },
            },
          });
        }
      }
    }

    responsiveSliders();
    matchMediaSlider.addEventListener("change", () => {
      responsiveSliders();
    });
  }

  if (document.querySelector(".default-slider")) {
    const defaultSliders = document.querySelectorAll(".default-slider");

    defaultSliders.forEach((el, i) => {
      el.classList.add("_is-init");

      let defaultSlider = new Swiper(el, {
        modules: [Navigation, Pagination],
        slidesPerView: "auto",
        spaceBetween: 6,
        wrapperClass: "default-slider__items",
        slideClass: "default-slider__item",
        slideActiveClass: "default-slider__item_active",
        slidePrevClass: "default-slider__item_prev",
        slideNextClass: "default-slider__item_next",
        navigation: {
          prevEl: el.querySelector(".default-slider__btn_prev"),
          nextEl: el.querySelector(".default-slider__btn_next"),
          disabledClass: "_is-disabled",
          lockClass: "_is-lock",
        },
        pagination: {
          clickable: true,
          bulletElement: "button",
          el: el.querySelector(".default-slider__pagination"),
          lockClass: "_is-lock",
          bulletClass: "default-slider__bullet",
          bulletActiveClass: "_is-active",
        },
        breakpoints: {
          1600: {
            spaceBetween: 10,
          },
        },
        on: {
          init: (swiper) => {
            swiper.el.classList.toggle("_is-lock", swiper.isLocked);
          },
          resize: (swiper) => {
            swiper.el.classList.toggle("_is-lock", swiper.isLocked);
          },
        },
      });
    });
  }

  if (document.querySelector(".cabinet-extra")) {
    const extraSliderElement = document.querySelector(".cabinet-extra");
    const extraSliderDelay = Number(extraSliderElement.getAttribute("data-delay"));

    extraSliderElement.classList.add("_is-init");

    new Swiper(extraSliderElement, {
      modules: [Autoplay, Navigation, EffectFade],
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      loop: true,
      speed: 1000,
      autoplay: {
        delay: extraSliderDelay ? extraSliderDelay : 5000,
        disableOnInteraction: false,
      },
      observer: true,
      allowTouchMove: false,
      wrapperClass: "cabinet-extra__items",
      slideClass: "cabinet-extra__item",
      slideActiveClass: "cabinet-extra__item_active",
      slidePrevClass: "cabinet-extra__item_prev",
      slideNextClass: "cabinet-extra__item_next",
      navigation: {
        prevEl: ".cabinet-extra__btn_prev",
        nextEl: ".cabinet-extra__btn_next",
        disabledClass: "cabinet-extra__btn_disabled",
        lockClass: "cabinet-extra__btn_is-lock",
      },
      on: {
        init: (swiper) => {
          swiper.el.classList.toggle("_is-lock", swiper.isLocked);
        },
        resize: (swiper) => {
          swiper.el.classList.toggle("_is-lock", swiper.isLocked);
        },
      },
    });
  }

  const rangeInit = () => {
    const rangeElements = document.querySelectorAll("[data-range]");

    rangeElements.forEach((rangeElement) => {
      const rangeMinInput = rangeElement.querySelector("[data-range-min]");
      const rangeMinValue = Number(rangeMinInput.getAttribute("data-range-min"));
      const rangeMaxInput = rangeElement.querySelector("[data-range-max]");
      const rangeMaxValue = Number(rangeMaxInput.getAttribute("data-range-max"));
      const rangeInputs = [rangeMinInput, rangeMaxInput];
      const rangeSlider = rangeElement.querySelector("[data-range-body]");

      noUiSlider.create(rangeSlider, {
        start: [rangeMinValue, rangeMaxValue],
        connect: true,
        range: {
          min: rangeMinValue,
          max: rangeMaxValue,
        },
        format: {
          from: function (value) {
            return parseInt(value);
          },
          to: function (value) {
            return parseInt(value);
          },
        },
      });

      rangeSlider.noUiSlider.on("update", function (values, i) {
        rangeInputs[i].value = values[i];
      });

      // Listen to keydown events on the input field.
      rangeInputs.forEach((input, i) => {
        input.addEventListener("change", function () {
          rangeSlider.noUiSlider.setHandle(i, input.value);
        });

        input.addEventListener("keydown", function (e) {
          let values = rangeSlider.noUiSlider.get();
          let value = Number(values[i]);

          // [[handle0_down, handle0_up], [handle1_down, handle1_up]]
          let steps = rangeSlider.noUiSlider.steps();

          // [down, up]
          let step = steps[i];

          let position;

          // 13 is enter,
          // 37 is key left,
          // 38 is key up,
          // 39 is key right.
          // 40 is key down.
          switch (e.which) {
            case 13:
              rangeSlider.noUiSlider.setHandle(i, input.value);
              break;

            case 38:
            case 39:
              // Get step to go increase slider value (up)
              position = step[1];

              // false = no step is set
              if (position === false) {
                position = 1;
              }

              // null = edge of slider
              if (position !== null) {
                rangeSlider.noUiSlider.setHandle(i, value + position);
              }

              break;

            case 37:
            case 40:
              position = step[0];

              if (position === false) {
                position = 1;
              }

              if (position !== null) {
                rangeSlider.noUiSlider.setHandle(i, value - position);
              }

              break;
          }
        });
      });
    });
  };

  if (document.querySelector("[data-range]")) {
    rangeInit();
  }

  //---------- При клике
  document.addEventListener("click", documentActions);
  function documentActions(e) {
    const targetElement = e.target;

    //   Menu
    if (document.documentElement.classList.contains("_is-menu-open")) {
      if (!targetElement.closest(".menu") || targetElement.closest(".menu__link")) {
        menuClose();
      }
    }

    if (targetElement.closest(".assortment__btn") && window.innerWidth >= 1024) {
      setTimeout(() => {
        targetElement.parentElement.querySelector(".assortment__name").click();
      }, 300);
    }

    if (targetElement.closest("[data-assortment-close]")) {
      targetElement.parentElement.closest(".assortment__item").querySelector(".assortment__name").click();
    }

    dataAction(targetElement, "assortment");
    dataAction(targetElement, "header-extra");
    dataAction(targetElement, "search");
    dataAction(targetElement, "filters");

    if (
      targetElement.closest(".select_sort .select__title") ||
      targetElement.closest(".filter-choice__btn")
    ) {
      if (window.innerWidth >= 1024) {
        setTimeout(dropdownPosition(targetElement), 5);
      }
    }

    //   Product card buy
    if (targetElement.closest("[data-buy]")) {
      const parentElem = targetElement.parentElement;

      parentElem.classList.add("added");
    }

    //   Show / Hide Password
    if (targetElement.closest('[class*="__viewpass"]')) {
      let inputType = targetElement.classList.contains("active") ? "password" : "text";
      targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
      targetElement.classList.toggle("active");
    }
  }

  window.onscroll = function () {
    document.documentElement.classList.toggle("_is-scroll", document.documentElement.scrollTop > 50);
  };

  window.addEventListener("resize", () => {
    adaptiveFix();
  });
});

// Autosize textarea
const textareas = document.querySelectorAll('textarea.c-form__textarea');
textareas.forEach(textarea => {
  textarea.setAttribute('style', 'height:52px;overflow-y:hidden;background-color:#fff;');
  textarea.addEventListener("input", OnInput, false);
});

document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tabs');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            const tabsNav = tab.querySelector('.tabs__nav');
            if (!tabsNav) return;
            const tabsBtns = tabsNav.querySelectorAll('.tabs__btn');
            const tabsContent = tab.querySelector('.tabs__content');
            if (!tabsContent) return;
            const tabsPanels = tabsContent.querySelectorAll('.tabs__panel');

            tabsNav.addEventListener('click', e => {
                const targetBtn = e.target.closest('.tabs__btn');
                if (targetBtn) {
                    const previouslyActive = tabsNav.querySelector('.tabs__btn_active');
                    if (previouslyActive) {
                        previouslyActive.classList.remove('tabs__btn_active');
                    }
                    targetBtn.classList.add('tabs__btn_active');

                    tabsPanels.forEach(panel => {
                        panel.classList.remove('tabs__panel_active');
                    });
                    
                    const newActivePanelIndex = Array.from(tabsBtns).indexOf(targetBtn);
                    if(tabsPanels[newActivePanelIndex]) {
                        tabsPanels[newActivePanelIndex].classList.add('tabs__panel_active');
                    }
                }
            })
        });
    }
});

function OnInput() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
}

// Validation for contact forms
// Highlight empty required fields with a red border when the user tries to submit the form
(function () {
  const errorClass = '_is-error';

  // Helper to toggle error class based on value
  const toggleError = (input) => {
    if (input.value.trim() === '') {
      input.classList.add(errorClass);
      return false;
    } else {
      input.classList.remove(errorClass);
      return true;
    }
  };

  // Handle form submission
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('.c-form');
    if (!form) return;

    const inputs = form.querySelectorAll('.input__body');
    let allValid = true;
    inputs.forEach((input) => {
      const isValid = toggleError(input);
      if (!isValid) {
        allValid = false;
      }
    });

    if (!allValid) {
      e.preventDefault();
    }
  });

  // Remove error styling on user input
  document.addEventListener('input', (e) => {
    if (e.target.classList && e.target.classList.contains('input__body')) {
      toggleError(e.target);
    }
  });
})();

window["FLS"] = true;
isWebp();
addTouchClass();
addLoadedClass();
menuInit();

