<slot></slot>

<style>
    :global(:root) {
        --black: #181818;
        --primary: #558DE0;
        --white: #F7F7F7;
        --lightGray: #D9D7E0;
        --red: #EC7A73;
        --danger: var(--red);

        --background: var(--black);
        --textColor: var(--white);
        --buttonColor: var(--white);
        --buttonTextColor: var(--background);
        --buttonWarnTextColor: var(--white);
        --lineColor: var(--white);

        --borderRadius: 12px;
        --buttonBorderRadius: var(--borderRadiusFull);

        --bodyFont: "Avenir";
        --headingFont: "Avenir";

        --viewPadding: var(--s-8) var(--s-4);
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

    :global(h1, h2, h3, h4, h5, h6) {
        font-weight: bolder;
    }

    :global(.center) {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :global(.stretch) {
        width: 100%;
    }

    :global(*) {
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
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
</style>