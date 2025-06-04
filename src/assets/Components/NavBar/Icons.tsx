

import { SVGProps } from "react";
import { JSX } from "react/jsx-runtime";

export const InfinityIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="40" viewBox="0 0 48 48">
        <linearGradient id="4kcTVA6O6z_Nw1nBMv59ia_XrpVmPMACUYb_gr1" x1="1.663" x2="55.413" y1="15.426" y2="36.058" gradientUnits="userSpaceOnUse"><stop offset=".061" stopColor="#f0e400"></stop><stop offset=".201" stopColor="#f68b1f"></stop><stop offset=".35" stopColor="#00c25e"></stop><stop offset=".438" stopColor="#00addc"></stop><stop offset=".55" stopColor="#4641ba"></stop><stop offset=".606" stopColor="#622f96"></stop><stop offset=".877" stopColor="#662d91"></stop></linearGradient><path fill="url(#4kcTVA6O6z_Nw1nBMv59ia_XrpVmPMACUYb_gr1)" d="M35,35c-4.824,0-8.171-3.253-11-6.843C21.171,31.747,17.824,35,13,35C7.346,35,2,29.654,2,24 s5.346-11,11-11c4.824,0,8.171,3.253,11,6.843C26.829,16.253,30.176,13,35,13c5.654,0,11,5.346,11,11S40.654,35,35,35z M27.11,24 c2.44,3.249,4.857,6,7.89,6c3.175,0,6-3.355,6-6s-2.825-6-6-6C31.968,18,29.551,20.751,27.11,24z M13,18c-3.175,0-6,3.355-6,6 s2.825,6,6,6c3.032,0,5.449-2.751,7.89-6C18.449,20.751,16.032,18,13,18z"></path><g><linearGradient id="4kcTVA6O6z_Nw1nBMv59ib_XrpVmPMACUYb_gr2" x1="11.129" x2="41.352" y1="10.86" y2="41.69" gradientUnits="userSpaceOnUse"><stop offset=".07" stopColor="#f99d20"></stop><stop offset=".101" stopColor="#f99920"></stop><stop offset=".135" stopColor="#f78c21"></stop><stop offset=".17" stopColor="#f57621"></stop><stop offset=".206" stopColor="#f35822"></stop><stop offset=".242" stopColor="#ef3123"></stop><stop offset=".26" stopColor="#ed1c24"></stop><stop offset=".425" stopColor="#ed1c24"></stop><stop offset=".437" stopColor="#e31d2c"></stop><stop offset=".497" stopColor="#b62350"></stop><stop offset=".555" stopColor="#93276c"></stop><stop offset=".609" stopColor="#7a2a81"></stop><stop offset=".658" stopColor="#6b2c8d"></stop><stop offset=".698" stopColor="#662d91"></stop><stop offset="1" stopColor="#623293"></stop></linearGradient><path fill="url(#4kcTVA6O6z_Nw1nBMv59ib_XrpVmPMACUYb_gr2)" d="M35,30c-7.34,0-11-17-22-17c0,1.63,0,3.312,0,5c7.479,0,11,17,22,17 c0.073,0,0.146-0.011,0.219-0.013c-0.119-1.663-0.175-3.326-0.199-4.989C35.014,29.999,35.007,30,35,30z"></path></g>
    </svg>
);

export const HamburgetMenuOpen = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        {...props}
    >
        <path fill="rgba(255, 255, 255, 0)" d="M0 0h24v24H0z" />
        <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 17h18M3 12h18M3 7h18"
        />
    </svg>
);

export const HamburgetMenuClose = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        {...props}
    >
        <path fill="rgba(255, 255, 255, 0)" d="M0 0h24v24H0z" />
        <g fill="none" fillRule="evenodd">
            <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z" />
            <path
                fill="currentColor"
                d="m12 14.121 5.303 5.304a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879 6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.303a1.5 1.5 0 1 0 2.122 2.122L12 14.12Z"
            />
        </g>
    </svg>
);