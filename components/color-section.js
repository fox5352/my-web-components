const template = document.createElement("template");
template.innerHTML = `
    <style>
        :root {
            --bg-bg-color: #ffff;
            --bg-bd-color: #1F1F23;
        }
        *, *::after, *::before {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
        }

        .body {
            width: 100%;
            height: 100%;

            position: relative;
            overflow: hidden;
        }
        .bg {
            position: absolute;
            left: -35%;
            width: 260%;
            height: 100%;
            background-color: var(--bg-bg-color);
            // transform: skew(-30deg);
            z-index: -50;
        }
        .block {
            display: inline-block;

            color: transparent;
            border: 1px solid var(--bg-bd-color);
        }

    </style>

    <div class="body" id="body">
        <div class="bg" id="bg">
        </div>
        <slot name="main">
        </slot>
    </div>
`;


class ColorSection extends HTMLElement {
    constructor() {
        super();

        // Attach the shadow DOM and append the template content
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.body = this.shadowRoot.getElementById("body");
        this.bg = this.shadowRoot.querySelector("#bg");

        this.colors = ["#008b8b", "#ff7f50", "#20BF3F"];
        this.nodes = [];
        this.bodySize = {
            x: 0,
            y: 0
        };
        this.blockSize = {
            x: 5,
            y: 5
        };
        this.maxCount = 0;
    }
    
    // Invoked when the custom element is first connected to the document's DOM.
    connectedCallback(){
        this.getAllAttributes()

        requestAnimationFrame(() => {
            this.setVars();
            this.diplayBlocks();
            this.body.addEventListener("resize", this.updater);
            window.addEventListener("mousemove", event => {
                const mouseX = event.clientX;
                const mouseY = event.clientY;

                this.nodes.forEach((node) => {
                    const temp = node.getBoundingClientRect()
                    let blockLines = {
                        l: temp.left,
                        r: temp.right,
                        t: temp.top,
                        b: temp.bottom
                    };

                    if (mouseY > blockLines.t && mouseY < blockLines.b) {
                        if (mouseX > blockLines.l && mouseX < blockLines.r) {
                            
                            node.style.backgroundColor  = this.colors[Math.floor(Math.random()*this.colors.length)];

                            setTimeout(()=> {
                                node.style.opacity = "0.4"
                            }, 120);
                            setTimeout(()=> {
                                node.style.opacity = "1"
                                node.style.backgroundColor = "transparent"
                            }, 350);
                        }
                    }
                })
            });
        });
    }
    
    // Invoked when the custom element is disconnected from the document's DOM.
    disconnectedCallback(){}
    // Invoked when one of the custom element's attributes is added, removed, or changed.
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
    }

    getAllAttributes() {
        for (let i = 0; i < this.attributes.length; i++) {
            const attr = this.attributes[i];

            switch (attr.name) {
                case "colors":
                    this.colors = attr.value.split(',');
                    break;
                case "block-x":
                    this.blockSize.x = attr.value;
                case "block-y":
                    this.blockSize.y = attr.value;
                    break;
                default:
                    break;
            }
        }
    }

    setVars() {        
        this.bodySize.x = this.bg.offsetWidth;
        this.bodySize.y = this.bg.offsetHeight;



        const bx = (this.bodySize.x * this.blockSize.x) / 100;
        const by = (this.bodySize.y * this.blockSize.y) / 100;

        const bmx = this.bodySize.x / bx;
        const bmy = this.bodySize.y / by;

        this.maxCount = Math.ceil(bmy * bmx);

        // console.log(this.bodySize.x);
        // console.log((this.bodySize.x * this.blockSize.x)/100);
        // console.log(bmx);
        // console.log("------");
        // console.log(this.bodySize.y);
        // console.log((this.bodySize.y * this.blockSize.y)/100);
        // console.log(bmy);
    }

    blockBuilder() {
        const block = document.createElement("div");
        block.style.width = ((this.bodySize.x * this.blockSize.x) / 100) + "px";
        block.style.height = ((this.bodySize.y * this.blockSize.y) / 100) + "px";
        // block.style.width = `${this.blockSize.x}%`;
        // block.style.height = `${this.blockSize.y}%`;

        block.classList.add("block");
        block.innerText = 'p'

        return block;
    }

    diplayBlocks() {
        let buffer = [];

        for (let x = 0; x < this.maxCount; x++) {
            const block = this.blockBuilder();
            
            this.nodes.push(block);
            
            buffer.push(block);
        }     
        
        this.bg.append(...buffer);
    }

    updater() {
        this.setGlobalVars();
        this.displayBlocks();
    }
}

// Define the custom element
customElements.define("color-section", ColorSection);