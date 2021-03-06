export const vert = `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;

    void main () {
        uv = position;

        gl_Position = vec4(1.0 - 2.0 * uv, 0, 1);
    }
`

// TODO test other devicePixelRatios (1, 1.5, 4)
export const frag = ({ easing }: { easing: boolean }) => `
    precision mediump float;

    uniform sampler2D source;
    uniform sampler2D depthMap;
    uniform vec3 size;
    uniform float dx;
    uniform float dy;
    
    varying vec2 uv;

    const float EASING = ${easing ? -1 : 1}.;

    /**
     * Mirroring helps fake information around the edges
     * For example, if the offset pixel x (or, drifted pixel) 
     * is > width, then we grab the pixel color at 
     * width - (offsetPixelX - width)
    */
    vec2 mirrored(vec2 v) {
        vec2 m = mod(v, 2.);
        return mix(m,2.0 - m, step(1.0 ,m));
    }

    void main () {
        vec4 resolution = vec4(size.x, size.y, 1., 1.);
        vec2 uv = 2. * gl_FragCoord.xy / resolution.xy;
        vec2 vUv = (uv - vec2(0.5)) * resolution.zw + vec2(0.5);
        vUv = vUv * size.z;
        
        vec4 depthTexture = texture2D(depthMap, mirrored(vUv)); 
        
        // 1. - r channel to make white the foreground
        float depth = (((1. - depthTexture.r) * EASING) + 1.) / 255.;

        vec2 fake3d = vec2(
            // honestly not sure why dx and dy have
            // to be backwards
            vUv.x + depth * dy, 
            (-vUv.y) + depth * dx
        );

        gl_FragColor = texture2D(source, mirrored(fake3d));

        // View debug
        // gl_FragColor = texture2D(depthMap, mirrored(fake3d));
    }
`