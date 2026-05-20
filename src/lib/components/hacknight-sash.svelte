



<div class="ribbon ribbon-top-right">
    <marquee>Join us @ Hack Night @ The Rusty Nail @ 7:00 P.M. every Tuesday</marquee>
</div>


<style>
    /* .box {
        position: relative;
        max-width: 600px;
        width: 90%;
        height: 400px;
        background: #fff;
        box-shadow: 0 0 15px rgba(0,0,0,.1);
    } */

    /* common */
    .ribbon {
        width: 150px;
        height: 150px;
        overflow: hidden;
        position: absolute;
    }
    .ribbon::before,
    .ribbon::after {
        position: absolute;
        z-index: -1;
        content: '';
        display: block;
        border: 5px solid #2980b9;
    }
    .ribbon marquee {
        position: absolute;
        display: block;
        width: 225px;
        padding: 15px 0;
        background-color: #3498db;
        box-shadow: 0 5px 10px rgba(0,0,0,.1);
        color: #fff;
        font: 700 18px/1 'Lato', sans-serif;
        text-shadow: 0 1px 1px rgba(0,0,0,.2);
        text-transform: uppercase;
        text-align: center;
    }

    /* top left*/
    .ribbon-top-left {
        top: -10px;
        left: -10px;
    }
    .ribbon-top-left::before,
    .ribbon-top-left::after {
        border-top-color: transparent;
        border-left-color: transparent;
    }
    .ribbon-top-left::before {
        top: 0;
        right: 0;
    }
    .ribbon-top-left::after {
        bottom: 0;
        left: 0;
    }
    .ribbon-top-left marquee {
        right: -25px;
        top: 30px;
        transform: rotate(-45deg);
    }

    /* top right*/
    .ribbon-top-right {
        top: -10px;
        right: -10px;
    }
    .ribbon-top-right::before,
    .ribbon-top-right::after {
    border-top-color: transparent;
    border-right-color: transparent;
    }
    .ribbon-top-right::before {
    top: 0;
    left: 0;
    }
    .ribbon-top-right::after {
    bottom: 0;
    right: 0;
    }
    .ribbon-top-right marquee {
    left: -25px;
    top: 30px;
    transform: rotate(45deg);
    }

    /* bottom left*/
    .ribbon-bottom-left {
    bottom: -10px;
    left: -10px;
    }
    .ribbon-bottom-left::before,
    .ribbon-bottom-left::after {
    border-bottom-color: transparent;
    border-left-color: transparent;
    }
    .ribbon-bottom-left::before {
    bottom: 0;
    right: 0;
    }
    .ribbon-bottom-left::after {
    top: 0;
    left: 0;
    }
    .ribbon-bottom-left marquee {
    right: -25px;
    bottom: 30px;
    transform: rotate(225deg);
    }

    /* bottom right*/
    .ribbon-bottom-right {
    bottom: -10px;
    right: -10px;
    }
    .ribbon-bottom-right::before,
    .ribbon-bottom-right::after {
    border-bottom-color: transparent;
    border-right-color: transparent;
    }
    .ribbon-bottom-right::before {
    bottom: 0;
    left: 0;
    }
    .ribbon-bottom-right::after {
    top: 0;
    right: 0;
    }
    .ribbon-bottom-right marquee {
    left: -25px;
    bottom: 30px;
    transform: rotate(-225deg);
    }
</style>