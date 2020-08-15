<div class='background'>
    <div class='modal'>
        <slot />
    </div>
</div>

<style>
    .background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--white);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--viewPadding);
    }

    .modal {
        --modalPadding: var(--s-6) var(--s-8);
        --modalShadow: var(--level-2);
        background: var(--background);
        border-radius: var(--borderRadius);
        box-shadow: var(--modalShadow);
        padding: var(--modalPadding);
        width: 100%;
    }
</style>