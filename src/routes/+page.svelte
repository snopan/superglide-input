<div class="
    {[
        'w-scren',
        'h-screen',
        'flex',
        'items-center',
        'justify-center',
        textBackground,
    ].join(" ")}
">
    <div class="text-white text-6xl">
        { textDisplay }
    </div>
</div>

<script lang="ts">
    import "../index.css";

    const INITIAL_TEXT = "Press 'Space' then 'C' or 'V'";
    const SUCCESS = "Great super glide input!";
    const FAIL_WRONG_ORDER = "Wrong order, try to press 'Space' before 'C' or 'V'";
    const FAIL_SLOW_TIMING = "A bit slow there, try to press them closer together";
    const INITIAL_COLOR = "bg-amber-500";
    const SUCCESS_COLOR = "bg-green-500";
    const FAIL_COLOR = "bg-red-500";
    let textDisplay = INITIAL_TEXT
    let textBackground = INITIAL_COLOR;
    let resetTextTimeout: NodeJS.Timeout;
    let numberSuccess = 0;

    const JUMP_KEY = "Space"
    const CROUCH_KEYS = ["KeyC", "KeyV"]
    const MAX_TIME_BETWEEN_INPUTS = 6.5

    let firstInput: string | false = false;
    let startTime = 0

    const isSameInput = (inputA: string, inputB: string) => {
        const allInputs = [[JUMP_KEY], CROUCH_KEYS]

        for (let inputs of allInputs) {
            if (inputs.includes(inputA) && inputs.includes(inputB)) {
                return true
            }
        }

        console.log('returned false')
        return false
    }
    
    const resetToInitial = () => {
        textDisplay = INITIAL_TEXT
        textBackground = INITIAL_COLOR
    }

    const finishRound = (roundFirstInput: string) => {
        const finishTime = Date.now()
        const timeBetweenInputs = finishTime - startTime

        if (timeBetweenInputs >= MAX_TIME_BETWEEN_INPUTS) {
            textDisplay = FAIL_SLOW_TIMING
            textBackground = FAIL_COLOR
            numberSuccess = 0
        }
        else if (CROUCH_KEYS.includes(roundFirstInput)) {
            textDisplay = FAIL_WRONG_ORDER
            textBackground = FAIL_COLOR
            numberSuccess = 0
        }
        else {
            numberSuccess ++
            textDisplay = SUCCESS + ` ${numberSuccess}x`
            textBackground = SUCCESS_COLOR
        }

        firstInput = false
        resetTextTimeout = setTimeout(resetToInitial, 2000)
    }

    const onKeyPress = (event: KeyboardEvent) => {
        const code = event.code;

        if (![JUMP_KEY, ...CROUCH_KEYS].includes(code)) return

        if (!firstInput) {
            firstInput = code
            startTime = Date.now()

        }
        else if (!isSameInput(firstInput, code)) {
            clearTimeout(resetTextTimeout)
            finishRound(firstInput)
        }
    }

    document.addEventListener('keypress', onKeyPress)
</script>