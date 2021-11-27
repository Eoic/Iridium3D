import * as THREE from 'three';
import { Color, Mesh, Scene } from 'three';

export class Grid {
    private color: Color;
    private outerSize: number;
    private innerSize: number;
    private distance: number;
    private mesh: Mesh;

    constructor(outerSize, innerSize, color, distance, axes = "xzy") {
        this.color = new THREE.Color(color);
        this.outerSize = outerSize || 10;
        this.innerSize = innerSize || 100;
        this.distance = distance || 10_000;

        const planeAxes = axes.substr(0, 2);
        const geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            depthWrite: false,

            uniforms: {
                uouterSize: {
                    value: this.outerSize,
                },
                uinnerSize: {
                    value: this.innerSize,
                },
                uColor: {
                    value: this.color,
                },
                uDistance: {
                    value: this.distance,
                },
            },
            transparent: true,
            vertexShader: `
                    varying vec3 worldPosition;
                    uniform float uDistance;
                    
                    void main() {
                        vec3 pos = position.${axes} * uDistance;
                        pos.${planeAxes} += cameraPosition.${planeAxes};
                        worldPosition = pos;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
       `,

        fragmentShader: `
            varying vec3 worldPosition;
            
            uniform float uouterSize;
            uniform float uinnerSize;
            uniform vec3 uColor;
            uniform float uDistance;

            float getGrid(float size) {
                vec2 r = worldPosition.${planeAxes} / size;
                vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
                float line = min(grid.x, grid.y);
                return 1.0 - min(line, 1.0);
            }
                
            void main() {
                float d = 1.0 - min(distance(cameraPosition.${planeAxes}, worldPosition.${planeAxes}) / uDistance, 1.0);
                float g1 = getGrid(uouterSize);
                float g2 = getGrid(uinnerSize);
                
                gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
                gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);
                
                if ( gl_FragColor.a <= 0.0 ) discard;     
            }`,
            extensions: {
                derivatives: true,
            },
        });

        this.mesh = new Mesh(geometry, material);
        this.mesh.frustumCulled = false;
    }

    public attach(scene: Scene) {
        scene.add(this.mesh);
    }
}