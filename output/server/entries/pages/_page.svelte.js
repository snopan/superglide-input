import { c as create_ssr_component, e as escape } from "../../chunks/index.js";
const index = "";
const INITIAL_TEXT = "Press 'Space' then 'C' or 'V'";
const SUCCESS = "Great super glide input!";
const FAIL_WRONG_ORDER = "Wrong order, try to press 'Space' before 'C' or 'V'";
const FAIL_SLOW_TIMING = "A bit slow there, try to press them closer together";
const INITIAL_COLOR = "bg-amber-500";
const SUCCESS_COLOR = "bg-green-500";
const FAIL_COLOR = "bg-red-500";
const JUMP_KEY = "Space";
const MAX_TIME_BETWEEN_INPUTS = 100;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let textDisplay = INITIAL_TEXT;
  let textBackground = INITIAL_COLOR;
  let resetTextTimeout;
  let numberSuccess = 0;
  const CROUCH_KEYS = ["KeyC", "KeyV"];
  let firstInput = false;
  let startTime = 0;
  const isSameInput = (inputA, inputB) => {
    const allInputs = [[JUMP_KEY], CROUCH_KEYS];
    for (let inputs of allInputs) {
      if (inputs.includes(inputA) && inputs.includes(inputB)) {
        return true;
      }
    }
    console.log("returned false");
    return false;
  };
  const resetToInitial = () => {
    textDisplay = INITIAL_TEXT;
    textBackground = INITIAL_COLOR;
  };
  const finishRound = (roundFirstInput) => {
    const finishTime = Date.now();
    const timeBetweenInputs = finishTime - startTime;
    if (timeBetweenInputs >= MAX_TIME_BETWEEN_INPUTS) {
      textDisplay = FAIL_SLOW_TIMING;
      textBackground = FAIL_COLOR;
      numberSuccess = 0;
    } else if (CROUCH_KEYS.includes(roundFirstInput)) {
      textDisplay = FAIL_WRONG_ORDER;
      textBackground = FAIL_COLOR;
      numberSuccess = 0;
    } else {
      numberSuccess++;
      textDisplay = SUCCESS + ` ${numberSuccess}x`;
      textBackground = SUCCESS_COLOR;
    }
    firstInput = false;
    resetTextTimeout = setTimeout(resetToInitial, 2e3);
  };
  const onKeyPress = (event) => {
    const code = event.code;
    if (![JUMP_KEY, ...CROUCH_KEYS].includes(code))
      return;
    if (!firstInput) {
      firstInput = code;
      startTime = Date.now();
    } else if (!isSameInput(firstInput, code)) {
      clearTimeout(resetTextTimeout);
      finishRound(firstInput);
    }
  };
  document.addEventListener("keypress", onKeyPress);
  return `<div class="${"" + escape(
    [
      "w-scren",
      "h-screen",
      "flex",
      "items-center",
      "justify-center",
      textBackground
    ].join(" "),
    true
  )}"><div class="${"text-white text-6xl"}">${escape(textDisplay)}</div>
</div>`;
});
export {
  Page as default
};
