varying vec3 worldPosition;

uniform vec3 uColor;
uniform float uDistance;
uniform float uInnerSize;
uniform float uOuterSize;

float getGrid(float size) {
    vec2 r = worldPosition.xz / size;
    vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
    float line = min(grid.x, grid.y);
    return 1.0 - min(line, 1.0);
}

void main() {
    float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / uDistance, 1.0);
    float g1 = getGrid(uInnerSize);
    float g2 = getGrid(uOuterSize);
    
    vec4 color = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
    float alpha = mix(0.5 * color.a, color.a, g2);

    if (abs(worldPosition.x) <= 0.04)
        color.rgb = vec3(0.0, 1.0, 0);
    else if (abs(worldPosition.z) <= 0.04)
        color.rgb = vec3(1.0, 0.0, 0.0);

    gl_FragColor = color;
    gl_FragColor.a = alpha;

    if (gl_FragColor.a <= 0.0)
        discard;
}