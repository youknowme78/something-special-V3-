/* =========================================================
   PAGE NAVIGATION
========================================================= */

function goTo(pageId) {

    const currentPage =
        document.querySelector(".screen.active");

    const nextPage =
        document.getElementById(pageId);

    if (!nextPage) {
        return;
    }

    if (currentPage) {
        currentPage.classList.remove("active");
    }

    setTimeout(() => {
        nextPage.classList.add("active");
    }, 80);
}


/* =========================================================
   FAST + SAFE MOVING BUTTON SYSTEM
========================================================= */

function makeButtonRunAway(button, area) {

    if (!button || !area) {
        return;
    }


    /*
    ---------------------------------------------------------
    SETTINGS
    ---------------------------------------------------------
    */

    const escapeDistance = 120;

    const escapeCooldown = 300;

    const movementDuration = 450;

    let lastEscapeTime = 0;

    let currentLeft = 0;

    let currentTop = 0;


    /*
    ---------------------------------------------------------
    INITIAL POSITION
    ---------------------------------------------------------
    */

    function setInitialPosition() {

        currentLeft = button.offsetLeft;

        currentTop = button.offsetTop;

    }


    /*
    ---------------------------------------------------------
    KEEP BUTTON INSIDE THE AREA
    ---------------------------------------------------------
    */

    function clamp(value, min, max) {

        return Math.max(
            min,
            Math.min(
                value,
                max
            )
        );

    }


    /*
    ---------------------------------------------------------
    MOVE BUTTON AWAY FROM CURSOR
    ---------------------------------------------------------
    */

    function escapeFromCursor(
        pointerX,
        pointerY
    ) {

        const now =
            performance.now();


        /*
        Prevent the button from
        continuously recalculating
        every single frame.
        */

        if (
            now - lastEscapeTime
            < escapeCooldown
        ) {

            return;

        }


        lastEscapeTime = now;


        const areaRect =
            area.getBoundingClientRect();


        const buttonRect =
            button.getBoundingClientRect();


        /*
        Current button center
        */

        const buttonCenterX =
            buttonRect.left +
            buttonRect.width / 2;


        const buttonCenterY =
            buttonRect.top +
            buttonRect.height / 2;


        /*
        Direction from cursor
        toward button.
        */

        let directionX =
            buttonCenterX -
            pointerX;


        let directionY =
            buttonCenterY -
            pointerY;


        /*
        Calculate distance.
        */

        let distance =
            Math.sqrt(
                directionX * directionX +
                directionY * directionY
            );


        /*
        If the cursor is almost exactly
        on the button, choose a random
        direction instead of getting stuck.
        */

        if (distance < 1) {

            const randomAngle =
                Math.random()
                * Math.PI
                * 2;


            directionX =
                Math.cos(randomAngle);


            directionY =
                Math.sin(randomAngle);


            distance = 1;

        }


        /*
        Normalize direction.
        */

        directionX /=
            distance;


        directionY /=
            distance;


        /*
        Strong movement away from cursor.
        */

        const moveDistance =
            130 +
            Math.random() * 70;


        /*
        Add a little sideways randomness
        so the button doesn't repeatedly
        move in exactly one direction.
        */

        const sideAngle =
            (
                Math.random() - 0.5
            ) * 0.9;


        const cos =
            Math.cos(sideAngle);


        const sin =
            Math.sin(sideAngle);


        const newDirectionX =
            directionX * cos -
            directionY * sin;


        const newDirectionY =
            directionX * sin +
            directionY * cos;


        /*
        Calculate desired screen position.
        */

        let desiredScreenX =
            buttonCenterX +
            newDirectionX *
            moveDistance;


        let desiredScreenY =
            buttonCenterY +
            newDirectionY *
            moveDistance;


        /*
        -----------------------------------------------------
        SAFETY BOUNDARIES

        The button is NEVER allowed
        outside the choice area.
        -----------------------------------------------------
        */

        const safeMargin = 8;


        const minScreenX =
            areaRect.left +
            safeMargin;


        const maxScreenX =
            areaRect.right -
            buttonRect.width -
            safeMargin;


        const minScreenY =
            areaRect.top +
            safeMargin;


        const maxScreenY =
            areaRect.bottom -
            buttonRect.height -
            safeMargin;


        /*
        Convert screen coordinates
        into coordinates relative
        to the choice area.
        */

        let newLeft =
            desiredScreenX -
            areaRect.left;


        let newTop =
            desiredScreenY -
            areaRect.top;


        /*
        HARD CLAMP

        This guarantees that the
        button stays inside the area.
        */

        newLeft =
            clamp(
                newLeft,
                0,
                Math.max(
                    0,
                    areaRect.width -
                    buttonRect.width
                )
            );


        newTop =
            clamp(
                newTop,
                0,
                Math.max(
                    0,
                    areaRect.height -
                    buttonRect.height
                )
            );


        /*
        -----------------------------------------------------
        SECOND SAFETY CHECK

        Make sure the destination itself
        isn't too close to the cursor.
        -----------------------------------------------------
        */

        const destinationCenterX =
            areaRect.left +
            newLeft +
            buttonRect.width / 2;


        const destinationCenterY =
            areaRect.top +
            newTop +
            buttonRect.height / 2;


        const destinationDistance =
            Math.sqrt(

                Math.pow(
                    destinationCenterX -
                    pointerX,
                    2
                )

                +

                Math.pow(
                    destinationCenterY -
                    pointerY,
                    2
                )

            );


        /*
        If destination is still too close,
        force it to the opposite side.
        */

        if (
            destinationDistance
            < escapeDistance * 0.75
        ) {

            const oppositeX =
                areaRect.left +
                areaRect.width -
                (
                    buttonRect.width +
                    newLeft
                );


            const oppositeY =
                areaRect.top +
                areaRect.height -
                (
                    buttonRect.height +
                    newTop
                );


            newLeft =
                clamp(
                    oppositeX,
                    0,
                    areaRect.width -
                    buttonRect.width
                );


            newTop =
                clamp(
                    oppositeY,
                    0,
                    areaRect.height -
                    buttonRect.height
                );

        }


        /*
        Save position.
        */

        currentLeft = newLeft;

        currentTop = newTop;


        /*
        Move smoothly.
        */

        button.style.transition =
            `left ${movementDuration}ms ease-out,
             top ${movementDuration}ms ease-out`;


        button.style.left =
            `${currentLeft}px`;


        button.style.top =
            `${currentTop}px`;

    }


    /*
    ---------------------------------------------------------
    DESKTOP MOUSE MOVEMENT
    ---------------------------------------------------------
    */

    area.addEventListener(
        "mousemove",
        function(event) {

            const buttonRect =
                button.getBoundingClientRect();


            const centerX =
                buttonRect.left +
                buttonRect.width / 2;


            const centerY =
                buttonRect.top +
                buttonRect.height / 2;


            const distance =
                Math.sqrt(

                    Math.pow(
                        event.clientX -
                        centerX,
                        2
                    )

                    +

                    Math.pow(
                        event.clientY -
                        centerY,
                        2
                    )

                );


            /*
            Escape BEFORE cursor reaches
            the button.
            */

            if (
                distance <
                escapeDistance
            ) {

                escapeFromCursor(
                    event.clientX,
                    event.clientY
                );

            }

        }
    );


    /*
    ---------------------------------------------------------
    EXTRA SAFETY:
    If cursor actually reaches button,
    immediately move it.
    ---------------------------------------------------------
    */

    button.addEventListener(
        "mouseenter",
        function(event) {

            escapeFromCursor(
                event.clientX,
                event.clientY
            );

        }
    );


    /*
    ---------------------------------------------------------
    MOBILE / TOUCH
    ---------------------------------------------------------
    */

    button.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();


            const touch =
                event.touches[0];


            if (!touch) {
                return;
            }


            escapeFromCursor(
                touch.clientX,
                touch.clientY
            );

        },
        {
            passive: false
        }
    );


    /*
    ---------------------------------------------------------
    INITIALIZE
    ---------------------------------------------------------
    */

    setTimeout(
        setInitialPosition,
        100
    );

}


/* =========================================================
   INITIALIZE BOTH RUNNING BUTTONS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
        QUESTION 1

        YES button runs away.
        */

        const question1Area =
            document.querySelector(
                "#question1 .choice-area"
            );


        const changeYes =
            document.getElementById(
                "changeYes"
            );


        makeButtonRunAway(
            changeYes,
            question1Area
        );


        /*
        QUESTION 2

        NO button runs away.
        */

        const question2Area =
            document.querySelector(
                "#question2 .choice-area"
            );


        const waitNo =
            document.getElementById(
                "waitNo"
            );


        makeButtonRunAway(
            waitNo,
            question2Area
        );

    }
);


/* =========================================================
   ONE LAST SURPRISE
========================================================= */

function lastSurprise() {

    /*
    Don't create multiple final pages.
    */

    if (
        document.querySelector(
            ".final-note-page"
        )
    ) {

        return;

    }


    /*
    Create controlled heart burst.
    */

    createHeartBurst();


    /*
    Open final page after animation.
    */

    setTimeout(
        openFinalNote,
        1050
    );

}


/* =========================================================
   HEART BURST
========================================================= */

function createHeartBurst() {

    const hearts = [

        "❤️",
        "💖",
        "💕",
        "💗",
        "💓",
        "💞",
        "💘",
        "✨"

    ];


    /*
    Controlled number of hearts.
    */

    const numberOfHearts = 28;


    for (
        let i = 0;
        i < numberOfHearts;
        i++
    ) {

        const heart =
            document.createElement(
                "div"
            );


        heart.className =
            "burst-heart";


        heart.textContent =
            hearts[
                Math.floor(
                    Math.random() *
                    hearts.length
                )
            ];


        /*
        Random direction.
        */

        const angle =
            Math.random() *
            Math.PI *
            2;


        /*
        Random distance.
        */

        const distance =
            130 +
            Math.random() * 270;


        const x =
            Math.cos(angle) *
            distance;


        const y =
            Math.sin(angle) *
            distance;


        const rotation =
            Math.random() *
            600 -
            300;


        heart.style.setProperty(
            "--x",
            `${x}px`
        );


        heart.style.setProperty(
            "--y",
            `${y}px`
        );


        heart.style.setProperty(
            "--rotation",
            `${rotation}deg`
        );


        heart.style.fontSize =
            (
                18 +
                Math.random() * 15
            ) +
            "px";


        document.body.appendChild(
            heart
        );


        setTimeout(
            () => {

                heart.remove();

            },
            1500
        );

    }

}


/* =========================================================
   FINAL NOTE PAGE
========================================================= */

function openFinalNote() {

    if (
        document.querySelector(
            ".final-note-page"
        )
    ) {

        return;

    }


    const finalPage =
        document.createElement(
            "div"
        );


    finalPage.className =
        "final-note-page";


    finalPage.innerHTML = `

        <div
            class="final-note-container"
        >

            <!-- DECORATIVE HEARTS -->

            <div
                class="photo-decoration heart-one"
            >
                ❤️
            </div>


            <div
                class="photo-decoration heart-two"
            >
                💕
            </div>


            <div
                class="photo-decoration heart-three"
            >
                💖
            </div>


            <div
                class="photo-decoration heart-four"
            >
                💗
            </div>



            <!-- PHOTO -->

            <div
                class="final-photo-wrapper"
            >

                <div
                    class="photo-ring"
                ></div>


                <img
                    src="images/final-photo.jpg"
                    alt="A special memory"
                    class="final-photo"
                >

            </div>



            <!-- FINAL TITLE -->

            <h1
                class="final-note-title"
            >

                One Last Thing... ❤️

            </h1>



            <!-- FINAL MESSAGE -->

            <div
                class="final-note"
            >

                <!-- ✏️ CHANGE PARAGRAPH 1 -->

                <p>

                    Well....enaku epudi solrathu nu therila but happy birthday

                </p>


                <!-- ✏️ CHANGE PARAGRAPH 2 -->

                <p>

                    ennala enna panna mudiyum nu therila anaa un mogathula oru 
                    chinna siripaa pakurathu kaga i will this world upside down

                </p>


                <!-- ✏️ CHANGE PARAGRAPH 3 -->

                <p>

                    iniku poii antha nilla va paru un azhagula athu kuda vaykathula paathi mogatha marachi irukum

                </p>

            </div>



            <!-- SIGNATURE -->

            <div
                class="final-signature"
            >

                Many more happy returns of the day,

                <br>

                HARSHINI

            </div>


            <button
                class="main-btn"
                onclick="closeFinalNote()"
            >

                Keep this memory 💕

            </button>


        </div>

    `;


    document.body.appendChild(
        finalPage
    );

}


/* =========================================================
   CLOSE FINAL PAGE
========================================================= */

function closeFinalNote() {

    const finalPage =
        document.querySelector(
            ".final-note-page"
        );


    if (!finalPage) {
        return;
    }


    finalPage.style.transition =
        "opacity 0.5s ease";


    finalPage.style.opacity =
        "0";


    setTimeout(
        () => {

            finalPage.remove();

            goTo("last");

        },
        500
    );

}