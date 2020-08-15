<div class='container'>
    <div class='background'></div>
    <div class='modal'>
        <slot />
    </div>
</div>

<style>
    .container, .background {        
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;                
    }

    .container {
        padding: var(--viewPadding);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .background {
        z-index: 1;
        opacity: .5;
        background: var(--white);
    }

    .modal {
        z-index: 2;
        --modalPadding: var(--s-6) var(--s-8);
        --modalShadow: var(--level-2);
        background: var(--background);
        border-radius: var(--borderRadius);
        box-shadow: var(--modalShadow);
        padding: var(--modalPadding);
        width: 100%;
    }
</style>