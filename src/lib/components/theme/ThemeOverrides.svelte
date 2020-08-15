<script lang='ts'>
    import { COLORS } from '@lib/constants'

    const setCSSVariable = ([name, value]: [string, string]) => {
        document.documentElement.style.setProperty(`--${name}`, value)
    }

    Object.entries(COLORS).forEach(setCSSVariable)
</script>

<slot></slot>

<style>
    :global(:root) {
        --black: #181818;
        --lightGray: #D9D7E0;
        --darkGray: #373737;

        /* These colors are defined using js */        
        --white: magenta;
        --brown: magenta;
        --red: magenta;
        --red: magenta;
        --red: magenta;
        --red: magenta;

        --danger: var(--red);
        --background: var(--black);
        --textColor: var(--white);
        --buttonColor: var(--white);
        --buttonTextColor: var(--background);
        --buttonWarnTextColor: var(--white);
        --lineColor: var(--white);

        --borderRadius: 22px;
        --buttonBorderRadius: var(--borderRadiusFull);

        --bodyFont: "Avenir";
        --headingFont: "Avenir";

        --viewPadding: var(--s-8) var(--s-4);

        --glowAnimation: glow 2s ease-in-out alternate infinite;        
    }

    /* TODO Register */
    @font-face {
        font-family: 'Avenir';
        src: url('/Averta-Book.otf');
        font-weight: normal;
    }

    @font-face {
        font-family: 'Avenir';
        src: url('/Averta-Roman.otf');
        font-weight: lighter;
    }

    @font-face {
        font-family: 'Avenir';
        src: url('/Averta-Black.otf');
        font-weight: bolder;
    }
    
    :global(*) {
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* TODO move to ollopa */
    :global(body) {
        margin: 0;
    }
    :global(p, h1, h2, h3, h4, h5, h6) {
        margin-top: 0;
        margin-bottom: 0;
    }

    :global(h1, h2, h3, h4, h5, h6) {
        font-weight: bolder;
    }

    :global(a) {
        color: var(--primary);
        text-decoration: none;
        font-weight: bolder;
    }    

    /* TODO: select? */
    :global(input, textarea) {
        -webkit-user-select: auto !important;
        -khtml-user-select: auto !important;
        -moz-user-select: auto !important;
        -ms-user-select: auto !important;
        user-select: auto !important;
    }

    :global(label) {
        font-weight: lighter;
    }

    :global(.center) {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :global(.stretch) {
        width: 100%;
    }

    :global(.hide-scrollbar::-webkit-scrollbar) {
        display: none;
    }

    /* Animations */
    @keyframes -global-glow {
        from { 
            opacity: 0; 
            filter: drop-shadow(0px 3px 0px rgba(255, 255, 255, 0.2));
        }
        to { 
            opacity: 1; 
            filter: drop-shadow(0px 3px 10px rgba(255, 255, 255, 0.4)) !important;
        }
    }
</style>