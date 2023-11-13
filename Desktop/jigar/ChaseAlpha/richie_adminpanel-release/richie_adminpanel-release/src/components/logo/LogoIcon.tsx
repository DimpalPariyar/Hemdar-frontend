// material-ui

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === 'dark' ? logoIconDark : logoIcon} alt="Mantis" width="100" />
     *
     */
    <svg width="202" height="94" viewBox="0 0 202 94" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.8171 72.8427C23.5667 71.7549 26.3887 69.792 28.2965 66.9662C30.1913 64.1412 31.145 61.1294 31.145 57.9197C31.145 57.6279 31.1316 57.336 31.1054 57.018C30.8932 53.4494 29.4095 50.2124 26.6402 47.308C24.2824 45.0263 21.9369 43.6864 19.5921 43.2883C17.2605 42.8771 14.968 42.6779 12.7422 42.6779C11.9741 42.6779 11.1662 42.7049 10.3448 42.758C9.33719 42.7842 8.27769 42.7976 7.19128 42.7976V86.1739C7.19128 87.6201 6.67442 88.8672 5.62799 89.9145C4.5812 90.9626 3.3225 91.4932 1.87843 91.4932H1.79883V37.399H15.8957C19.5125 37.399 22.7587 38.195 25.6203 39.7863C28.4685 41.3784 30.8139 43.4746 32.6422 46.0609C34.457 48.6472 35.5699 51.0217 35.9541 53.1706C36.3517 55.3199 36.5371 57.0041 36.5371 58.225C36.5371 60.1483 36.2725 62.0715 35.7291 64.0214C34.815 67.1521 33.0659 70.0434 30.4432 72.6837C29.158 74.0101 27.6874 75.1375 26.0572 76.0658C27.5412 77.1008 28.8 78.4142 29.8602 79.9928L37.5839 91.4932H36.2325C34.6562 91.4932 33.4371 91.4138 32.576 91.2544C31.6219 91.1085 30.8005 90.6311 30.1117 89.8618C29.436 89.079 28.5215 87.8056 27.3824 86.0148C26.8391 85.1527 26.1768 84.1443 25.395 82.9772C24.4408 81.6112 23.2886 80.563 21.9507 79.8334V79.7937C20.5725 79.0641 19.0488 78.7061 17.3663 78.7061C16.8759 78.7591 16.3856 78.7854 15.8957 78.7854C15.8957 77.3796 16.1741 76.1586 16.7436 75.0979C17.3132 74.0232 18.3334 73.2804 19.8171 72.8427Z" fill="#3856EE" />
      <path d="M45.2026 53.2911H50.5947V86.1342C50.5947 87.6066 50.0778 88.8668 49.0444 89.901C47.9977 90.936 46.7524 91.4531 45.2688 91.4531H45.2026V53.2911ZM47.8789 39.496C48.9648 39.496 49.8925 39.8806 50.674 40.663C51.4427 41.4458 51.8399 42.3745 51.8399 43.4622C51.8399 44.5499 51.4427 45.4783 50.674 46.2611C49.8925 47.0304 48.9648 47.4281 47.8789 47.4281C46.7924 47.4281 45.8648 47.0304 45.0965 46.2611C44.3412 45.4783 43.957 44.5499 43.957 43.4622C43.957 42.3745 44.3412 41.4458 45.0965 40.663C45.8648 39.8806 46.7924 39.496 47.8789 39.496Z" fill="#3856EE" />
      <path d="M96.2749 81.6719C94.4332 84.776 91.9558 87.243 88.8161 89.0604C85.7688 90.8115 82.4169 91.7002 78.7734 91.7002C75.9514 91.7002 73.3152 91.1696 70.8509 90.1215C68.3869 89.0735 66.2272 87.6145 64.3724 85.7575C62.5311 83.8874 61.087 81.725 60.0271 79.2577C58.9538 76.8039 58.4238 74.1644 58.4238 71.3655C58.4238 68.5532 58.9538 65.9002 60.0271 63.4468C61.087 60.979 62.5311 58.8175 64.3724 56.96C66.2272 55.1164 68.3869 53.6707 70.8509 52.596C73.3152 51.5349 75.9514 51.0043 78.7734 51.0043C82.4169 51.0043 85.7688 51.9064 88.8161 53.6837C91.9558 55.4746 94.4332 57.9284 96.2749 61.0326L95.6126 61.4169C94.6586 61.9212 93.7179 62.16 92.8169 62.16C91.5451 62.16 90.3529 61.656 89.2134 60.6475C88.2728 59.7724 87.2524 59.0027 86.1399 58.3531C83.914 57.0528 81.4631 56.416 78.7734 56.416C76.6937 56.416 74.7592 56.801 72.9445 57.5703C71.1293 58.3531 69.5526 59.4274 68.2146 60.807C66.8367 62.1465 65.7634 63.7251 64.995 65.5422C64.2136 67.3596 63.8294 69.2964 63.8294 71.3655C63.8294 73.4216 64.2136 75.3449 64.995 77.1623C65.7634 78.9792 66.8367 80.5711 68.2146 81.9371C69.5526 83.2902 71.1293 84.3513 72.9445 85.1341C74.7592 85.9034 76.6937 86.2881 78.7734 86.2881C81.4631 86.2881 83.914 85.6516 86.1399 84.3513C87.2524 83.7018 88.2728 82.9456 89.2134 82.0565C90.3529 81.0485 91.5451 80.5444 92.8169 80.5444C93.7179 80.5444 94.6586 80.7832 95.6126 81.2876L96.2749 81.6719Z" fill="#3856EE" />
      <path d="M102.833 91.4131V15.6889L100.635 18.8601C99.7977 20.0683 98.6534 20.8148 97.2157 21.0692C95.7679 21.3255 94.4464 21.0374 93.2299 20.1884L93.1758 20.1503L105.53 2.33485L117.886 20.1503L117.831 20.1884C116.614 21.0366 115.293 21.3255 113.845 21.0692C112.407 20.8148 111.264 20.0694 110.426 18.8601L108.226 15.6885V56.6718C109.763 55.2263 111.525 54.0851 113.526 53.2496C115.54 52.4275 117.66 52.0028 119.912 52.0028C122.27 52.0028 124.483 52.4537 126.55 53.3424C128.616 54.2445 130.431 55.4651 131.982 57.0172C133.559 58.5955 134.804 60.4259 135.691 62.4955C136.579 64.5782 137.03 66.7933 137.03 69.1409V91.4131H136.949C135.479 91.4131 134.221 90.8956 133.188 89.861C132.154 88.826 131.638 87.5662 131.638 86.0938V69.1409C131.638 65.9047 130.485 63.1455 128.179 60.8637C125.9 58.5558 123.145 57.4149 119.912 57.4149C116.706 57.4149 113.95 58.5558 111.645 60.8637C109.366 63.1455 108.226 65.9047 108.226 69.1409V86.0938C108.226 87.5662 107.71 88.826 106.663 89.861C105.617 90.8956 104.357 91.4131 102.914 91.4131H102.833Z" fill="#3856EE" />
      <path d="M146.277 53.2911H151.669V86.1342C151.669 87.6066 151.152 88.8668 150.119 89.901C149.072 90.936 147.827 91.4531 146.343 91.4531H146.277V53.2911ZM148.953 39.496C150.04 39.496 150.967 39.8806 151.748 40.663C152.517 41.4458 152.915 42.3745 152.915 43.4622C152.915 44.5499 152.517 45.4783 151.748 46.2611C150.967 47.0304 150.04 47.4281 148.953 47.4281C147.867 47.4281 146.939 47.0304 146.171 46.2611C145.416 45.4783 145.031 44.5499 145.031 43.4622C145.031 42.3745 145.416 41.4458 146.171 40.663C146.939 39.8806 147.867 39.496 148.953 39.496Z" fill="#3856EE" />
      <path d="M197.43 81.5129C195.615 84.6432 193.138 87.1371 189.971 88.9811C186.897 90.7846 183.519 91.7002 179.85 91.7002C177.027 91.7002 174.391 91.1696 171.927 90.1084C169.462 89.0473 167.303 87.588 165.448 85.7575C163.607 83.8874 162.163 81.725 161.103 79.2577C160.03 76.8039 159.5 74.1512 159.5 71.339C159.5 68.5401 160.03 65.9002 161.103 63.4468C162.163 60.979 163.607 58.8175 165.448 56.96C167.303 55.0899 169.462 53.6309 171.927 52.5698C174.391 51.4952 177.027 50.9646 179.85 50.9646C182.644 50.9646 185.268 51.4952 187.719 52.5698C190.183 53.6309 192.343 55.0899 194.21 56.96C196.065 58.8175 197.536 60.979 198.596 63.4468C199.655 65.9002 200.185 68.5401 200.185 71.339V74.058H165.13C165.753 77.1353 167.144 79.7486 169.29 81.8975C170.629 83.2771 172.204 84.3513 174.02 85.1341C175.835 85.9034 177.77 86.2881 179.85 86.2881C182.565 86.2881 185.043 85.6381 187.295 84.3117C188.408 83.6617 189.427 82.8924 190.368 81.9772C191.522 80.916 192.753 80.3854 194.051 80.3854C194.926 80.3854 195.84 80.6372 196.768 81.1282L197.43 81.5129ZM169.29 60.7673C167.144 62.9162 165.753 65.5422 165.13 68.6459H194.515C193.919 65.5422 192.555 62.9162 190.395 60.7673C189.03 59.3877 187.44 58.313 185.625 57.5437C183.811 56.7613 181.889 56.3767 179.85 56.3767C177.77 56.3767 175.835 56.7613 174.02 57.5437C172.204 58.313 170.629 59.3877 169.29 60.7673Z" fill="#3856EE" />
      <path d="M78.8209 63.9255C83.0874 63.9255 86.5465 67.3886 86.5465 71.6605C86.5465 75.9325 83.0874 79.3955 78.8209 79.3955C74.5546 79.3955 71.0957 75.9325 71.0957 71.6605C71.0957 67.3886 74.5546 63.9255 78.8209 63.9255Z" fill="url(#paint0_linear_301_170127)" />
      <defs>
        <linearGradient id="paint0_linear_301_170127" x1="72.5186" y1="77.4628" x2="83.4083" y2="65.439" gradientUnits="userSpaceOnUse">
          <stop stop-color="#AB7D28" />
          <stop offset="0.289063" stop-color="#D9A22E" />
          <stop offset="0.507813" stop-color="#FAD950" />
          <stop offset="0.71875" stop-color="#F7DF7D" />
          <stop offset="1" stop-color="#AB7D28" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LogoIcon;
