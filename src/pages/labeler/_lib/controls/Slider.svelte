<script>
    import { Flex } from '@ollopa/cedar'

    export let label = ''
    export let store = null
    export let options = [0, 10, 1]

    const [min, max, step] = options
</script>

<Flex justify='between'>
    <label>{label}</label>
    <strong>{$store}</strong>
</Flex>

<input 
    type='range' 
    bind:value={$store}
    {min}
    {max}
    {step}
/>

<style>
    input[type=range] {
        --trackBorderRadius: 99px;
        --thumbBorderRadius: 99px;
        --thumbBorder: 4px solid var(--background);
        --trackColor: var(--white);
        --thumbColor: var(--white);
        --thumbSize: 28px;
        --trackHeight: 6px;
        --thumbShadow: inset -3px -3px 0px rgba(0, 24, 88, 0.2);;
        -webkit-appearance: none;
        background-color: var(--background);
        height: calc(var(--thumbSize));
        margin: 10px 0;
        width: 100%;
        border: none;
    }
    input[type=range]:focus {
        outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: var(--trackHeight);
        cursor: pointer;
        animate: 0.2s;
        background: var(--trackColor);
        border-radius: var(--trackBorderRadius);
    }
    input[type=range]::-webkit-slider-thumb {
        box-shadow: var(--thumbShadow);
        height: var(--thumbSize);
        width: var(--thumbSize);
        border-radius: var(--thumbBorderRadius);
        background: var(--thumbColor);
        cursor: pointer;
        -webkit-appearance: none;
        border: var(--thumbBorder);
        margin-top: -10.5px;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
        background: var(--trackColor);
    }
    input[type=range]::-moz-range-track {
        width: 100%;
        height: var(--trackHeight);
        cursor: pointer;
        animate: 0.2s;
        background: var(--trackColor);
        border-radius: var(--trackBorderRadius);
    }
    input[type=range]::-moz-range-thumb {
        box-shadow: var(--thumbShadow);
        height: var(--thumbSize);
        width: var(--thumbSize);
        border-radius: var(--thumbBorderRadius);
        background: var(--thumbColor);
        border: var(--thumbBorder);
        cursor: pointer;
    }
</style>
