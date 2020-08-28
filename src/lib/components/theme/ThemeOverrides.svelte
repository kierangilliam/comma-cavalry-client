<script lang='ts'>
    import { COLORS } from '@lib/constants'
    import { setCSSVar } from '@lib/utils'    
    import { setContext } from 'svelte'
    import { writable } from 'svelte/store'

    const overflowHidden = writable<boolean>(false)

    setContext('theme', { overflowHidden })

    Object.entries(COLORS).forEach(setCSSVar)

    overflowHidden.subscribe(hidden => {
        if (hidden) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'scroll-y'
        }
    })
</script>

<slot></slot>

<style>
    :global(:root) {
        /* Colors */
        --black: #181818;
        --lightGray: #D9D7E0;
        --darkGray: #373737;
        /* These colors are defined using js */        
        --white: magenta;
        --brown: magenta;
        --red: magenta;

        /* Color intetntions */
        --danger: var(--red);
        --background: var(--black);
        --textColor: var(--white);
        --buttonColor: var(--white);
        --buttonTextColor: var(--background);
        --buttonWarnTextColor: var(--white);
        --lineColor: var(--white);

        /* Borders */
        --borderRadius: 22px;
        --borderRadiusSmall: 12px;
        --buttonBorderRadius: var(--borderRadiusFull);

        /* Typography */
        --bodyFont: "Avenir";
        --headingFont: "Avenir";
        --textSmall: .75rem;

        --viewPaddingTop: var(--s-8);
        --viewPaddingBottom: var(--s-8);
        --viewPaddingLeft: var(--s-4);
        --viewPaddingRight: var(--s-4);
        --viewPadding: var(--viewPaddingTop)
                        var(--viewPaddingRight) 
                        var(--viewPaddingBottom) 
                        var(--viewPaddingLeft); 

        /* Modal */
        --modalPaddingX: var(--s-8);
        --modalPaddingY: var(--s-6);
        --modalShadow: var(--level-2);
        --maxModalWidth: 600px;

        --glowAnimation: glow 2s ease-in-out alternate infinite;        
    }
    
    @media screen and (max-width: 325px) {
        :global(body) {
            font-size: 14px;
        }
    }   

    @supports(padding: max(0px)) {
        .post {
            padding-left: max(12px, env(safe-area-inset-left));
            padding-right: max(12px, env(safe-area-inset-right));
        }
        :global(:root) {
            --viewPaddingTop: max(env(safe-area-inset-top), var(--s-8));
            --viewPaddingBottom: max(env(safe-area-inset-bottom), var(--s-8));            
            --viewPaddingLeft: max(env(safe-area-inset-left), var(--s-4));
            --viewPaddingRight: max(env(safe-area-inset-right), var(--s-4));
        }
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
    :global(button:hover) {
        cursor: pointer;
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

    :global(.tag) {
        box-shadow: inset 0px -2.5px 0 rgba(12, 12, 12, .2);
        padding: var(--s-1) var(--s-2);
        font-weight: bolder;
        border-radius: 5px;
        background: var(--lightGray);
        color: var(--black);
    }

    :global(.monospace) {
        font-family: monospace;
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
   
    @keyframes -global-glow-soft {
        from { 
            opacity: .75; 
            filter: drop-shadow(0px 3px 5px rgba(255, 255, 255, 0.25));
        }
        to { 
            opacity: 1; 
            filter: 
                drop-shadow(0px 3px 10px rgba(255, 255, 255, 0.2))
                drop-shadow(0px 3px 5px rgba(255, 255, 255, 0.3))
            ;
        }
    }
</style>