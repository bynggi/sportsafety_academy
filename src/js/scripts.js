// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    const header = document.querySelector('.main-header');
    if (header) {
        // greeting.html 페이지인지 확인
        const isGreetingPage = window.location.pathname.includes('greeting.html') || 
                               window.location.href.includes('greeting.html');
        
        const updateHeaderAppearance = () => {
            // greeting.html 페이지에서는 항상 .is-solid 유지
            if (isGreetingPage) {
                header.classList.add('is-solid');
            } else {
                // index.html 등 다른 페이지에서는 스크롤에 따라 처리
                if (window.scrollY > 0) {
                    header.classList.add('is-solid');
                } else {
                    header.classList.remove('is-solid');
                }
            }
        };

        updateHeaderAppearance();
        // greeting.html이 아닐 때만 스크롤 이벤트 리스너 추가
        if (!isGreetingPage) {
            window.addEventListener('scroll', updateHeaderAppearance, { passive: true });
        }
    }

    const mainVisualVideo = document.querySelector('.main-visual__video');
    if (mainVisualVideo) {
        const setVideoPlaybackRate = () => {
            mainVisualVideo.playbackRate = 0.7;
        };

        if (mainVisualVideo.readyState >= 1) {
            setVideoPlaybackRate();
        } else {
            mainVisualVideo.addEventListener('loadedmetadata', setVideoPlaybackRate, { once: true });
        }
    }
    
    // 모바일 네비게이션 동적 생성 및 반응형 처리
    initResponsiveNavigation();
    
    // 접근성: 네비게이션 키보드 제어
    initNavigationAccessibility();
    
    // 현재 페이지에 맞는 메뉴 항목에 active 클래스 추가
    setActiveMenu();
    
    // menu-box가 열릴 때 active 클래스 추가
    initMenuBoxActive();
    
    // Values Slider 초기화
    initValuesSlider();
    
    // 말줄임표 툴팁 초기화
    initEllipsisTooltips();
    
    // Talent Section 자동 확장 초기화
    initTalentAutoExpand();
    
    // Talent Section 슬라이더 초기화
    initTalentSlider();
    
    // 로고 SVG 텍스트 색상 변경 초기화
    initLogoTextColor();
    
    // Footer 드롭다운 초기화
    initFooterDropdowns();
    
    // 게시판 날짜 형식 초기화
    initBoardDateFormat();
    
    // 네비게이션 링크 클릭 시 부드러운 스크롤 (서브메뉴가 없는 링크만)
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    navLinks.forEach(link => {
        // 서브메뉴가 있는 메뉴 링크는 제외
        const navItem = link.closest('.nav-item');
        const hasSubMenu = navItem && navItem.querySelector('.sub-menu');
        
        // 서브메뉴가 있는 메뉴 링크는 클릭 이벤트 처리 (서브메뉴 토글)
        if (hasSubMenu && link.getAttribute('aria-haspopup') === 'true') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const menuLink = this;
                const subMenu = navItem.querySelector('.sub-menu');
                if (subMenu) {
                    toggleSubMenu(navItem, menuLink, subMenu);
                }
            });
        } else {
            // 서브메뉴가 없는 링크는 스크롤 처리
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
    
    // 데스크톱 검색 폼 제출 이벤트
    const searchForm = document.querySelector('#total_search_box form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSearch('total_keyword');
        });
    }
    
    // 데스크톱 검색 버튼 클릭 이벤트
    const desktopSearchBtn = document.getElementById('total_search_btn');
    if (desktopSearchBtn) {
        desktopSearchBtn.addEventListener('click', function() {
            handleSearch('total_keyword');
        });
    }
    
    // 입력 필드 내부 검색 아이콘 버튼 클릭 이벤트
    const srcinputSearchBtn = document.getElementById('srcinput_search_btn');
    if (srcinputSearchBtn) {
        srcinputSearchBtn.addEventListener('click', function() {
            handleSearch('total_keyword');
        });
    }
    
    // 모바일 검색 버튼 클릭 이벤트
    const mobileSearchBtn = document.getElementById('total_search_btn2');
    if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', function() {
            handleSearch('searchtxt');
        });
    }
    
    // 검색 처리 함수
    function handleSearch(inputId) {
        const searchInput = document.getElementById(inputId);
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        
        if (searchTerm) {
            // 검색 기능 구현 (실제 검색 API 호출 또는 페이지 이동)
            // 예: window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
        } else {
            // 검색어가 없으면 포커스 유지
            if (searchInput) {
                searchInput.focus();
            }
        }
    }
    
    // 게시판 탭 전환 기능 (접근성 개선)
    const tabButtons = document.querySelectorAll('.tab-btn[role="tab"]');
    const tabPanels = document.querySelectorAll('.tab-panel[role="tabpanel"]');
    
    tabButtons.forEach((button, index) => {
        // 클릭 이벤트
        button.addEventListener('click', function() {
            switchTab(this, tabButtons, tabPanels);
        });
        
        // 키보드 이벤트
        button.addEventListener('keydown', function(e) {
            let targetIndex = index;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    targetIndex = index > 0 ? index - 1 : tabButtons.length - 1;
                    tabButtons[targetIndex].focus();
                    switchTab(tabButtons[targetIndex], tabButtons, tabPanels);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    targetIndex = index < tabButtons.length - 1 ? index + 1 : 0;
                    tabButtons[targetIndex].focus();
                    switchTab(tabButtons[targetIndex], tabButtons, tabPanels);
                    break;
                case 'Home':
                    e.preventDefault();
                    tabButtons[0].focus();
                    switchTab(tabButtons[0], tabButtons, tabPanels);
                    break;
                case 'End':
                    e.preventDefault();
                    tabButtons[tabButtons.length - 1].focus();
                    switchTab(tabButtons[tabButtons.length - 1], tabButtons, tabPanels);
                    break;
            }
        });
    });
    
    // 탭 전환 함수
    function switchTab(activeButton, buttons, panels) {
        const targetTab = activeButton.getAttribute('data-tab');
        
        // 모든 탭 버튼과 패널에서 active 클래스 및 ARIA 속성 제거
        buttons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
            btn.removeAttribute('title'); // title 속성 제거
        });
        panels.forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });
        
        // 클릭한 탭 버튼과 해당 패널에 active 클래스 및 ARIA 속성 추가
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
        activeButton.setAttribute('title', '선택됨'); // 선택된 버튼에 title 추가
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
            targetPanel.classList.add('active');
            targetPanel.setAttribute('aria-hidden', 'false');
        }
        
        // 탭 전환 후 툴팁 업데이트
        if (window.updateEllipsisTooltips) {
            setTimeout(window.updateEllipsisTooltips, 50);
        }
    }
    
    // 초기 로드 시 활성화된 탭 버튼에 title 추가
    const initialActiveTab = document.querySelector('.tab-btn.active');
    if (initialActiveTab) {
        initialActiveTab.setAttribute('title', '선택됨');
    }
    
    // 섹션에 애니메이션 효과 추가
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// 접근성: 네비게이션 키보드 제어 함수
function initNavigationAccessibility() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach((item, index) => {
        const menuLink = item.querySelector(':scope > a[role="menuitem"]');
        const subMenu = item.querySelector('.sub-menu');
        const subMenuLinks = subMenu ? subMenu.querySelectorAll('a[role="menuitem"]') : [];
        
        if (!menuLink || !subMenu) return;
        
        // 메뉴 링크에 포커스 이벤트 (키보드 네비게이션용)
        menuLink.addEventListener('focus', function() {
            // 다른 메뉴의 서브메뉴는 닫되, 현재 메뉴는 유지
            const allItems = document.querySelectorAll('.nav-item');
            allItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherMenuLink = otherItem.querySelector(':scope > a[role="menuitem"]');
                    const otherSubMenu = otherItem.querySelector('.sub-menu');
                    if (otherMenuLink && otherSubMenu) {
                        closeSubMenu(otherItem, otherMenuLink, otherSubMenu);
                    }
                }
            });
        });
        
        // 메뉴 링크에 마우스 이벤트
        menuLink.addEventListener('mouseenter', function() {
            openSubMenu(item, menuLink, subMenu);
        });
        
        item.addEventListener('mouseleave', function() {
            closeSubMenu(item, menuLink, subMenu);
        });
        
        // 키보드 이벤트
        menuLink.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    toggleSubMenu(item, menuLink, subMenu);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    openSubMenu(item, menuLink, subMenu);
                    if (subMenuLinks.length > 0) {
                        subMenuLinks[0].focus();
                    }
                    break;
                case 'Escape':
                    closeSubMenu(item, menuLink, subMenu);
                    menuLink.focus();
                    break;
            }
        });
        
        // 서브 메뉴 링크에 키보드 이벤트
        subMenuLinks.forEach((subLink, subIndex) => {
            subLink.addEventListener('keydown', function(e) {
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        if (subIndex < subMenuLinks.length - 1) {
                            subMenuLinks[subIndex + 1].focus();
                        }
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        if (subIndex > 0) {
                            subMenuLinks[subIndex - 1].focus();
                        } else {
                            menuLink.focus();
                        }
                        break;
                    case 'Escape':
                        e.preventDefault();
                        closeSubMenu(item, menuLink, subMenu);
                        menuLink.focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        if (subMenuLinks.length > 0) {
                            subMenuLinks[0].focus();
                        }
                        break;
                    case 'End':
                        e.preventDefault();
                        if (subMenuLinks.length > 0) {
                            subMenuLinks[subMenuLinks.length - 1].focus();
                        }
                        break;
                }
            });
        });
    });
}

// 서브 메뉴 열기
function openSubMenu(item, menuLink, subMenu) {
    if (!subMenu) return;
    
    item.classList.add('is-open');
    menuLink.setAttribute('aria-expanded', 'true');
    subMenu.classList.add('is-visible');
}

// 서브 메뉴 닫기
function closeSubMenu(item, menuLink, subMenu) {
    if (!subMenu) return;
    
    item.classList.remove('is-open');
    menuLink.setAttribute('aria-expanded', 'false');
    subMenu.classList.remove('is-visible');
}

// 서브 메뉴 토글
function toggleSubMenu(item, menuLink, subMenu) {
    const isOpen = item.classList.contains('is-open');
    if (isOpen) {
        closeSubMenu(item, menuLink, subMenu);
    } else {
        closeAllSubMenus();
        openSubMenu(item, menuLink, subMenu);
    }
}

// 모든 서브 메뉴 닫기
function closeAllSubMenus() {
    const allItems = document.querySelectorAll('.nav-item');
    allItems.forEach(item => {
        const menuLink = item.querySelector(':scope > a[role="menuitem"]');
        const subMenu = item.querySelector('.sub-menu');
        if (menuLink && subMenu) {
            closeSubMenu(item, menuLink, subMenu);
        }
    });
}

// 모바일 전용 요소들의 원본 HTML 저장 (전역 변수로 관리)
if (!window.mobileElementsStorage) {
    window.mobileElementsStorage = {
        mobileNavHTML: null,
        mobileSearchMenuHTML: null,
        isStored: false
    };
}

// 모바일 전용 요소들을 DOM에서 제거/복원하는 함수
function manageMobileElements() {
    const isMobile = window.innerWidth <= 1280;
    let mobileNav = document.getElementById('newNavMobile');
    let mobileSearchMenu = document.getElementById('mobileSearchMenu');
    
    if (isMobile) {
        // 1280px 이하: 모바일 요소들을 DOM에 추가
        if (!mobileNav && window.mobileElementsStorage.mobileNavHTML) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = window.mobileElementsStorage.mobileNavHTML;
            const restoredNav = tempDiv.firstElementChild;
            document.body.appendChild(restoredNav);
        }
        
        if (!mobileSearchMenu && window.mobileElementsStorage.mobileSearchMenuHTML) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = window.mobileElementsStorage.mobileSearchMenuHTML;
            const restoredSearch = tempDiv.firstElementChild;
            document.body.appendChild(restoredSearch);
        }
        
        // 오버레이 생성
        let overlay = document.querySelector('.mobile-side-menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-side-menu-overlay';
            document.body.appendChild(overlay);
        }
    } else {
        // 1280px 초과: 모바일 요소들을 DOM에서 제거
        if (mobileNav && mobileNav.parentNode) {
            if (!window.mobileElementsStorage.isStored) {
                window.mobileElementsStorage.mobileNavHTML = mobileNav.outerHTML;
            }
            mobileNav.remove();
        }
        
        if (mobileSearchMenu && mobileSearchMenu.parentNode) {
            if (!window.mobileElementsStorage.isStored) {
                window.mobileElementsStorage.mobileSearchMenuHTML = mobileSearchMenu.outerHTML;
            }
            mobileSearchMenu.remove();
        }
        
        // 오버레이 제거
        const overlay = document.querySelector('.mobile-side-menu-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        window.mobileElementsStorage.isStored = true;
    }
}

// 반응형 네비게이션 초기화
function initResponsiveNavigation() {
    const desktopNav = document.getElementById('newnavDesktop');
    
    // 오버레이 변수 선언 (함수 스코프)
    let overlay = document.querySelector('.mobile-side-menu-overlay');
    
    // 초기 실행: 모바일 요소 관리
    manageMobileElements();
    
    // 오버레이 다시 찾기 (manageMobileElements에서 생성되었을 수 있음)
    overlay = document.querySelector('.mobile-side-menu-overlay');
    
    if (!desktopNav) return;
    
    // 모바일 요소들 다시 찾기 (복원되었을 수 있음)
    let mobileNav = document.getElementById('newNavMobile');
    let mobileSearchMenu = document.getElementById('mobileSearchMenu');
    const mobileMenuList = document.getElementById('mobileMenuList');
    const mobileContentArea = document.getElementById('mobileContentArea');
    const mobileSearchArea = mobileSearchMenu?.querySelector('.mobile-side-menu__search');
    const desktopSearchArea = document.querySelector('.new-gnbmn-desk-right .new-contsearch');
    const btnMenu = document.getElementById('btnMenu');
    const btnSearch = document.getElementById('btnSearch');
    const btnMenuClose = document.getElementById('btnMenuClose');
    const btnSearchClose = document.getElementById('btnSearchClose');
    
    // 모바일 요소들이 없으면 함수 종료 (1280px 초과일 때)
    if (!mobileNav || !mobileSearchMenu || !mobileMenuList || !mobileContentArea) {
        // 리사이즈 이벤트만 등록 (나중에 모바일로 전환될 수 있음)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                manageMobileElements();
                // 모바일 요소들이 추가되면 다시 초기화
                if (window.innerWidth <= 1280) {
                    initResponsiveNavigation();
                }
            }, 200);
        });
        return;
    }
    
    // 현재 활성화된 1depth 메뉴 인덱스
    let currentActiveIndex = -1;
    
    // 데스크톱 네비게이션을 모바일 네비게이션으로 변환하는 함수
    function convertDesktopToMobile() {
        const desktopMenu = desktopNav.querySelector('.new-gnbmn-desk');
        if (!desktopMenu) return;
        
        // 기존 모바일 메뉴 제거
        mobileMenuList.innerHTML = '';
        mobileContentArea.innerHTML = '';
        
        // 데스크톱 메뉴 항목들을 복사하여 모바일 형식으로 변환
        const desktopItems = desktopMenu.querySelectorAll(':scope > li');
        desktopItems.forEach((item, index) => {
            const mainLink = item.querySelector('a');
            const menuBox = item.querySelector('.new-menu-box');
            
            if (mainLink) {
                // 1depth 메뉴 아이템 생성 (왼쪽)
                const mobileItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = mainLink.href || '#';
                link.textContent = mainLink.textContent.trim();
                link.dataset.index = index;
                
                // 클릭 이벤트: 2depth 표시
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    showDepth2(index, menuBox);
                });
                
                mobileItem.appendChild(link);
                mobileMenuList.appendChild(mobileItem);
                
                // 첫 번째 메뉴가 서브메뉴가 있으면 기본으로 표시
                if (index === 0 && menuBox) {
                    showDepth2(0, menuBox);
                }
            }
        });
    }
    
    // 2depth 메뉴 표시 함수
    function showDepth2(index, menuBox) {
        // 1depth 메뉴 활성화
        const depth1Links = mobileMenuList.querySelectorAll('a');
        depth1Links.forEach((link, i) => {
            if (i === index) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        currentActiveIndex = index;
        
        // 2depth 컨텐츠 영역 초기화
        mobileContentArea.innerHTML = '';
        
        if (!menuBox) {
            return;
        }
        
        const depth2 = menuBox.querySelector('.new-depth2');
        if (!depth2) {
            return;
        }
        
        // 2depth 아이템들을 아코디언으로 생성
        const depth2Items = depth2.querySelectorAll(':scope > li');
        depth2Items.forEach((depth2Item) => {
            const depth2Container = document.createElement('div');
            depth2Container.className = 'mobile-depth2-item';
            
            const depth2Title = depth2Item.querySelector('p');
            const depth3 = depth2Item.querySelector('.new-depth3');
            
            if (depth2Title) {
                const header = document.createElement('div');
                header.className = 'depth2-header';
                header.textContent = depth2Title.textContent.trim();
                
                // 아코디언 토글
                if (depth3) {
                    header.addEventListener('click', function() {
                        const isOpen = header.classList.contains('is-open');
                        const depth3List = depth2Container.querySelector('.depth3-list');
                        
                        // 다른 아코디언 닫기
                        mobileContentArea.querySelectorAll('.depth2-header').forEach(h => {
                            if (h !== header) {
                                h.classList.remove('is-open');
                                h.nextElementSibling?.classList.remove('is-open');
                            }
                        });
                        
                        if (isOpen) {
                            header.classList.remove('is-open');
                            depth3List?.classList.remove('is-open');
                        } else {
                            header.classList.add('is-open');
                            depth3List?.classList.add('is-open');
                        }
                    });
                }
                
                depth2Container.appendChild(header);
                
                // 3depth 리스트 생성
                if (depth3) {
                    const depth3List = document.createElement('ul');
                    depth3List.className = 'depth3-list mobile-menu-list--depth2';
                    
                    const depth3Items = depth3.querySelectorAll(':scope > li');
                    depth3Items.forEach((depth3Item) => {
                        const depth3Link = depth3Item.querySelector('a');
                        if (depth3Link) {
                            const li = document.createElement('li');
                            const a = document.createElement('a');
                            a.href = depth3Link.href || '#';
                            a.textContent = depth3Link.textContent.trim();
                            li.appendChild(a);
                            depth3List.appendChild(li);
                        }
                    });
                    
                    depth2Container.appendChild(depth3List);
                }
                
                mobileContentArea.appendChild(depth2Container);
            }
        });
    }
    
    // 화면 크기에 따라 네비게이션 표시/숨김 처리
    function handleResize() {
        const isMobile = window.innerWidth <= 1280; // CSS와 동일한 기준 (1280px)
        
        // 데스크톱으로 전환될 때 모바일 메뉴 상태 복원
        if (!isMobile) {
            // 모바일 메뉴가 열려있으면 먼저 닫기 (DOM에서 제거되기 전에)
            const currentMobileNav = document.getElementById('newNavMobile');
            const currentMobileSearchMenu = document.getElementById('mobileSearchMenu');
            
            if (currentMobileNav && currentMobileNav.classList.contains('is-open')) {
                currentMobileNav.classList.remove('is-open');
                if (btnMenu) {
                    btnMenu.setAttribute('aria-expanded', 'false');
                }
            }
            
            if (currentMobileSearchMenu && currentMobileSearchMenu.classList.contains('is-open')) {
                currentMobileSearchMenu.classList.remove('is-open');
                if (btnSearch) {
                    btnSearch.setAttribute('aria-expanded', 'false');
                }
            }
            
            // body의 overflow 복원
            document.body.style.overflow = '';
            
            // 오버레이 제거
            const overlay = document.querySelector('.mobile-side-menu-overlay');
            if (overlay) {
                overlay.classList.remove('is-active');
            }
        }
        
        // 모바일 요소 관리 (DOM에서 제거/복원)
        manageMobileElements();
        
        // 모바일 요소들이 없으면 함수 종료 (1280px 초과일 때)
        const currentMobileNav = document.getElementById('newNavMobile');
        const currentMobileSearchMenu = document.getElementById('mobileSearchMenu');
        if (!currentMobileNav || !currentMobileSearchMenu) {
            // 데스크톱 모드: 데스크톱 네비게이션 표시
            if (!isMobile && desktopNav) {
                desktopNav.style.display = 'block';
            }
            return;
        }
        
        if (isMobile) {
            // 모바일 모드
            convertDesktopToMobile();
            desktopNav.style.display = 'none';
            currentMobileNav.style.display = 'block';
            // CSS 미디어 쿼리에서 처리하므로 JavaScript에서 스타일 설정 불필요
        } else {
            // 데스크톱 모드
            desktopNav.style.display = 'block';
            currentMobileNav.style.display = 'none';
        }
    }
    
    // 데스크톱 검색 영역을 모바일 검색 메뉴로 복사
    function copySearchToMobile() {
        if (!desktopSearchArea || !mobileSearchArea) return;
        
        // 기존 내용 제거
        mobileSearchArea.innerHTML = '';
        
        // 데스크톱 검색 영역 복제
        const clonedSearch = desktopSearchArea.cloneNode(true);
        mobileSearchArea.appendChild(clonedSearch);
        
        // 모바일 검색 버튼 이벤트 연결
        const mobileSearchBtn = clonedSearch.querySelector('#total_search_btn');
        if (mobileSearchBtn) {
            mobileSearchBtn.addEventListener('click', function() {
                handleSearch('total_keyword');
            });
        }
        
        // 모바일 검색 입력 필드 내부 검색 아이콘 버튼 클릭 이벤트
        const mobileSrcinputSearchBtn = clonedSearch.querySelector('#srcinput_search_btn');
        if (mobileSrcinputSearchBtn) {
            mobileSrcinputSearchBtn.addEventListener('click', function() {
                handleSearch('total_keyword');
            });
        }
        
        // 모바일 검색 폼 제출 이벤트
        const mobileSearchForm = clonedSearch.querySelector('form');
        if (mobileSearchForm) {
            mobileSearchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleSearch('total_keyword');
            });
        }
    }
    
    // 모바일 검색 메뉴 열기
    function openMobileSearch() {
        // 검색 영역 복사
        copySearchToMobile();
        
        // 다른 메뉴 닫기
        closeMobileMenu();
        
        mobileSearchMenu.classList.add('is-open');
        if (overlay) {
            overlay.classList.add('is-active');
        }
        document.body.style.overflow = 'hidden';
        if (btnSearch) {
            btnSearch.setAttribute('aria-expanded', 'true');
        }
    }
    
    // 모바일 검색 메뉴 닫기
    function closeMobileSearch() {
        mobileSearchMenu.classList.remove('is-open');
        if (overlay) {
            overlay.classList.remove('is-active');
        }
        document.body.style.overflow = '';
        if (btnSearch) {
            btnSearch.setAttribute('aria-expanded', 'false');
        }
    }
    
    // 모바일 메뉴 열기
    function openMobileMenu() {
        // 다른 메뉴 닫기
        closeMobileSearch();
        
        mobileNav.classList.add('is-open');
        if (overlay) {
            overlay.classList.add('is-active');
        }
        document.body.style.overflow = 'hidden';
        if (btnMenu) {
        btnMenu.setAttribute('aria-expanded', 'true');
        }
    }
    
    // 모바일 메뉴 닫기
    function closeMobileMenu() {
        mobileNav.classList.remove('is-open');
        if (overlay) {
            overlay.classList.remove('is-active');
        }
        document.body.style.overflow = '';
        if (btnMenu) {
        btnMenu.setAttribute('aria-expanded', 'false');
        }
    }
    
    // 모든 모바일 메뉴 닫기
    function closeAllMobileMenus() {
        closeMobileSearch();
        closeMobileMenu();
    }
    
    // 모바일 메뉴 토글
    function toggleMobileMenu() {
        if (mobileNav.classList.contains('is-open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    // 모바일 검색 토글
    function toggleMobileSearch() {
        if (mobileSearchMenu.classList.contains('is-open')) {
            closeMobileSearch();
        } else {
            openMobileSearch();
        }
    }
    
    // 이벤트 리스너
    if (btnMenu) {
        btnMenu.addEventListener('click', toggleMobileMenu);
    }
    
    if (btnSearch) {
        btnSearch.addEventListener('click', toggleMobileSearch);
    }
    
    if (btnMenuClose) {
        btnMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (btnSearchClose) {
        btnSearchClose.addEventListener('click', closeMobileSearch);
    }
    
    // 오버레이 클릭 시 모든 메뉴 닫기 (오버레이가 존재할 때만)
    if (overlay) {
        overlay.addEventListener('click', closeAllMobileMenus);
    }
    
    // 초기 실행
    handleResize();
    
    // 리사이즈 이벤트 (디바운싱)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });
}

// 현재 페이지에 맞는 메뉴 항목에 active 클래스 추가
function setActiveMenu() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.new-gnbmn-desk > li > a');
    
    // 현재 경로와 일치하는 메뉴 링크 찾기
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            // href가 현재 경로와 일치하는지 확인
            // 예: /front/main.do, /front/intro.do 등
            if (currentPath === href || currentPath.startsWith(href)) {
                link.classList.add('active');
            }
        }
    });
    
    // 서브메뉴 링크도 확인 (depth3의 링크들)
    const subMenuLinks = document.querySelectorAll('.new-menu-box .new-depth3 a');
    subMenuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            if (currentPath === href || currentPath.startsWith(href)) {
                link.classList.add('active');
                // 부모 메뉴 항목에도 active 클래스 추가
                const parentMenuLink = link.closest('.new-gnbmn-desk > li')?.querySelector(':scope > a');
                if (parentMenuLink) {
                    parentMenuLink.classList.add('active');
                }
            }
        }
    });
}

// menu-box가 열릴 때 active 클래스 추가
function initMenuBoxActive() {
    const menuItems = document.querySelectorAll('.new-gnbmn-desk > li');
    
    menuItems.forEach(menuItem => {
        const menuLink = menuItem.querySelector(':scope > a');
        const menuBox = menuItem.querySelector('.new-menu-box');
        
        if (!menuLink || !menuBox) return;
        
        let activeCheckInterval = null;
        let isHovering = false;
        
        // menu-box가 열려있는지 확인하는 함수
        const isMenuBoxOpen = () => {
            const computedStyle = window.getComputedStyle(menuBox);
            return computedStyle.opacity === '1' && computedStyle.pointerEvents !== 'none';
        };
        
        // active 상태를 유지하는 함수
        const maintainActive = () => {
            if (isMenuBoxOpen() || isHovering) {
                if (!menuLink.classList.contains('active')) {
                    menuLink.classList.add('active');
                }
            }
        };
        
        // active 상태를 체크하는 interval 시작
        const startActiveCheck = () => {
            if (activeCheckInterval) return;
            activeCheckInterval = setInterval(() => {
                maintainActive();
            }, 50); // 50ms마다 체크
        };
        
        // active 상태를 체크하는 interval 중지
        const stopActiveCheck = () => {
            if (activeCheckInterval) {
                clearInterval(activeCheckInterval);
                activeCheckInterval = null;
            }
        };
        
        // active 클래스를 제거해야 하는지 확인하는 함수
        const shouldRemoveActive = () => {
            const currentPath = window.location.pathname;
            const href = menuLink.getAttribute('href');
            const isCurrentPage = href && href !== '#' && (currentPath === href || currentPath.startsWith(href));
            
            // 현재 페이지가 아니고, menu-box가 열려있지 않고, hover 상태가 아니면 active 제거
            if (!isCurrentPage && !isMenuBoxOpen() && !isHovering) {
                return true;
            }
            return false;
        };
        
        // 마우스 진입 시 active 추가 및 체크 시작
        menuItem.addEventListener('mouseenter', function() {
            isHovering = true;
            if (!menuLink.classList.contains('active')) {
                menuLink.classList.add('active');
            }
            startActiveCheck();
        });
        
        // menu-box에 마우스 진입 시 active 유지 및 체크 시작
        menuBox.addEventListener('mouseenter', function() {
            isHovering = true;
            if (!menuLink.classList.contains('active')) {
                menuLink.classList.add('active');
            }
            startActiveCheck();
        });
        
        // menu-box transition 완료 후에도 active 유지 확인
        menuBox.addEventListener('transitionend', function(e) {
            if (e.propertyName === 'opacity') {
                maintainActive();
            }
        });
        
        // menu-box에서 마우스 이탈 시
        menuBox.addEventListener('mouseleave', function(e) {
            // menu-item으로 마우스가 이동하는 경우는 제외
            if (!menuItem.contains(e.relatedTarget)) {
                isHovering = false;
                setTimeout(() => {
                    if (shouldRemoveActive()) {
                        stopActiveCheck();
                        menuLink.classList.remove('active');
                    }
                }, 150);
            }
        });
        
        // 메뉴 항목에서 마우스 이탈 시
        menuItem.addEventListener('mouseleave', function(e) {
            // menu-box로 마우스가 이동하는 경우는 제외
            if (!menuBox.contains(e.relatedTarget)) {
                isHovering = false;
                setTimeout(() => {
                    if (shouldRemoveActive()) {
                        stopActiveCheck();
                        menuLink.classList.remove('active');
                    }
                }, 150);
            }
        });
        
        // 포커스 시 active 추가 및 체크 시작
        menuItem.addEventListener('focusin', function() {
            menuLink.classList.add('active');
            startActiveCheck();
        });
        
        // menu-box에 포커스 시 active 유지 및 체크 시작
        menuBox.addEventListener('focusin', function() {
            menuLink.classList.add('active');
            startActiveCheck();
        });
        
        // 포커스 아웃 시
        menuItem.addEventListener('focusout', function(e) {
            // menu-box 내부로 포커스가 이동한 경우는 제외
            if (!menuItem.contains(e.relatedTarget)) {
                setTimeout(() => {
                    if (shouldRemoveActive()) {
                        stopActiveCheck();
                        menuLink.classList.remove('active');
                    }
                }, 100);
            }
        });
        
        // menu-box에서 포커스 아웃 시
        menuBox.addEventListener('focusout', function(e) {
            // menu-item 내부로 포커스가 이동하는 경우는 제외
            if (!menuItem.contains(e.relatedTarget)) {
                setTimeout(() => {
                    if (shouldRemoveActive()) {
                        stopActiveCheck();
                        menuLink.classList.remove('active');
                    }
                }, 100);
            }
        });
    });
}

// Values Slider (5가지 핵심가치 무한 슬라이더)
function initValuesSlider() {
    const section = document.querySelector('.values-section');
    if (!section) {
        return;
    }

    const slider = section.querySelector('.values-slider');
    const track = section.querySelector('.values-slider__track');
    const list = section.querySelector('.values-slider__list');
    const originalCards = list ? list.querySelectorAll('.value-card') : [];
    const prevBtn = section.querySelector('.values-nav__btn--prev');
    const nextBtn = section.querySelector('.values-nav__btn--next');

    if (!slider || !track || !list || originalCards.length === 0) {
        return;
    }

    if (!prevBtn || !nextBtn) {
        return;
    }

    const totalCards = originalCards.length; // 실제 카드 개수 (5개)
    // 768px 이하에서는 1개씩, 그 이상에서는 3개씩 표시
    const getVisibleCards = () => window.innerWidth <= 768 ? 1 : 3;
    let visibleCards = getVisibleCards();
    
    // 무한 슬라이드를 위해 앞뒤로 카드 복제 (접근성을 위해 aria-hidden 추가)
    const cloneCards = (cards, position) => {
        const clonedCards = [];
        cards.forEach((card, index) => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.classList.add('value-card--clone');
            clonedCards.push(clone);
        });
        return clonedCards;
    };

    // 카드 복제 함수 (visibleCards에 따라 동적으로)
    const setupClones = () => {
        // 기존 복제 카드 제거
        const existingClones = list.querySelectorAll('.value-card--clone');
        existingClones.forEach(clone => clone.remove());
        
        visibleCards = getVisibleCards();
        
        // 앞에 복제 카드 추가 (뒤로 가기용)
        const frontClones = cloneCards(Array.from(originalCards).slice(-visibleCards), 'front');
        frontClones.forEach(clone => {
            list.insertBefore(clone, originalCards[0]);
        });

        // 뒤에 복제 카드 추가 (앞으로 가기용)
        const backClones = cloneCards(Array.from(originalCards).slice(0, visibleCards), 'back');
        backClones.forEach(clone => {
            list.appendChild(clone);
        });
    };
    
    // 초기 복제 설정
    setupClones();

    // 모든 카드 다시 선택 (원본 + 복제)
    const allCards = list.querySelectorAll('.value-card');
    const totalAllCards = allCards.length;
    
    // 페이지네이션 도트 생성 (768px 이하에서만)
    const createPagination = () => {
        if (window.innerWidth > 768) {
            // 기존 페이지네이션 제거
            const existingPagination = section.querySelector('.values-pagination');
            if (existingPagination) {
                existingPagination.remove();
            }
            return null;
        }
        
        // 기존 페이지네이션이 있으면 제거하고 새로 생성
        const existingPagination = section.querySelector('.values-pagination');
        if (existingPagination) {
            existingPagination.remove();
        }
        
        const pagination = document.createElement('div');
        pagination.className = 'values-pagination';
        
        // 실제 카드 개수만큼 도트 생성 (5개)
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('button');
            dot.className = 'values-pagination__dot';
            dot.setAttribute('aria-label', `${i + 1}번째 슬라이드로 이동`);
            dot.setAttribute('type', 'button');
            if (i === 0) {
                dot.classList.add('active');
            }
            pagination.appendChild(dot);
        }
        
        // 슬라이더 다음에 페이지네이션 추가
        slider.parentNode.insertBefore(pagination, slider.nextSibling);
        
        return pagination;
    };
    
    // 페이지네이션 도트 업데이트
    const updatePagination = (index) => {
        if (window.innerWidth > 768) return;
        
        const pagination = section.querySelector('.values-pagination');
        if (!pagination) return;
        
        const dots = pagination.querySelectorAll('.values-pagination__dot');
        // 실제 인덱스 계산 (복제 카드 제외)
        let realIndex;
        if (index >= visibleCards) {
            realIndex = (index - visibleCards) % totalCards;
        } else {
            realIndex = (totalCards - visibleCards + index) % totalCards;
        }
        if (realIndex < 0) realIndex += totalCards;
        
        dots.forEach((dot, i) => {
            if (i === realIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };
    
    // 특정 슬라이드로 이동 (페이지네이션 클릭용)
    const goToSlide = (targetIndex) => {
        if (isTransitioning || window.innerWidth > 768) return;
        isTransitioning = true;
        
        // 복제 카드 고려하여 실제 인덱스 계산
        currentIndex = visibleCards + targetIndex;
        updateSlider(currentIndex, true);
        updatePagination(currentIndex);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    };
    
    // 초기 위치 설정 (복제된 카드 뒤부터 시작)
    let currentIndex = visibleCards;
    let isTransitioning = false;

    // 카드 너비와 gap을 실제 DOM 요소에서 계산
    const getCardDimensions = () => {
        // 실제 카드 요소가 렌더링되어 있는지 확인
        if (originalCards.length === 0) {
            return { cardWidth: 400, gap: 24 }; // 기본값
        }

        // 첫 번째 원본 카드의 실제 너비 측정
        const firstCard = originalCards[0];
        const cardWidth = firstCard.offsetWidth;
        
        // gap은 CSS에서 계산된 값 사용 (getComputedStyle로 gap 값 가져오기)
        const listStyles = window.getComputedStyle(list);
        const gapValue = listStyles.gap || '24px';
        // 'px' 제거하고 숫자로 변환
        const gap = parseFloat(gapValue) || 24;
        
        return { cardWidth, gap };
    };

    // 슬라이더 위치 업데이트
    const updateSlider = (index, smooth = true) => {
        const { cardWidth, gap } = getCardDimensions();
        const translateX = -(index * (cardWidth + gap));
        
        list.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        list.style.transform = `translateX(${translateX}px)`;
    };

    // 다음 슬라이드 (카드 하나씩 왼쪽으로)
    const nextSlide = () => {
        if (isTransitioning) {
            return;
        }
        isTransitioning = true;

        currentIndex++;
        
        // 마지막 실제 카드에 도달하면 복제된 카드로 이동
        if (currentIndex >= totalCards + visibleCards) {
            // 복제된 카드 위치로 이동 (애니메이션)
            updateSlider(currentIndex, true);
            // 애니메이션 완료 후 순간적으로 원래 위치로 이동
            setTimeout(() => {
                list.style.transition = 'none';
                currentIndex = visibleCards;
                updateSlider(currentIndex, false);
                updatePagination(currentIndex);
                // 다음 프레임에서 애니메이션 재개
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        isTransitioning = false;
                    });
                });
            }, 500);
        } else {
            updateSlider(currentIndex, true);
            updatePagination(currentIndex);
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }
    };

    // 이전 슬라이드 (카드 하나씩 오른쪽으로)
    const prevSlide = () => {
        if (isTransitioning) {
            return;
        }
        isTransitioning = true;

        currentIndex--;
        
        // 첫 번째 실제 카드에서 이전으로 가면 복제된 카드로 이동
        if (currentIndex < visibleCards) {
            // 복제된 카드 위치로 이동 (애니메이션)
            updateSlider(currentIndex, true);
            // 애니메이션 완료 후 순간적으로 원래 위치로 이동
            setTimeout(() => {
                list.style.transition = 'none';
                currentIndex = totalCards + visibleCards - 1;
                updateSlider(currentIndex, false);
                updatePagination(currentIndex);
                // 다음 프레임에서 애니메이션 재개
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        isTransitioning = false;
                    });
                });
            }, 500);
        } else {
            updateSlider(currentIndex, true);
            updatePagination(currentIndex);
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }
    };

    // 버튼 이벤트
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
    });

    // 자동 슬라이드
    let autoSlideInterval = null;
    const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // 5초마다 자동 슬라이드
    };

    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    };

    // 마우스 호버 시 자동 슬라이드 정지
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // 초기화 - DOM이 완전히 렌더링되고 스타일이 적용된 후 실행
    const initializeSlider = () => {
        // 카드 크기가 제대로 계산될 때까지 대기
        const checkAndInit = () => {
            const { cardWidth } = getCardDimensions();
            if (cardWidth > 0) {
                updateSlider(currentIndex, false);
                updatePagination(currentIndex);
                createPagination();
                
                // 페이지네이션 도트 클릭 이벤트
                const pagination = section.querySelector('.values-pagination');
                if (pagination) {
                    const dots = pagination.querySelectorAll('.values-pagination__dot');
                    dots.forEach((dot, index) => {
                        dot.addEventListener('click', () => {
                            goToSlide(index);
                        });
                    });
                }
                
                startAutoSlide();
                } else {
                // 아직 렌더링되지 않았으면 다시 시도
                requestAnimationFrame(checkAndInit);
            }
        };
        checkAndInit();
    };

    // 초기화 실행
    setTimeout(initializeSlider, 100);

    // 리사이즈 시 위치 재조정 (카드 크기도 다시 계산)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const oldVisibleCards = visibleCards;
            visibleCards = getVisibleCards();
            
            // visibleCards가 변경되면 복제 카드 재설정
            if (oldVisibleCards !== visibleCards) {
                setupClones();
                // 모든 카드 다시 선택
                const allCards = list.querySelectorAll('.value-card');
                // currentIndex 재조정
                currentIndex = visibleCards;
            }
            
            // 리사이즈 시 카드 크기가 변경될 수 있으므로 다시 계산
            updateSlider(currentIndex, false);
            updatePagination(currentIndex);
            createPagination();
            
            // 페이지네이션 도트 클릭 이벤트 재등록
            const pagination = section.querySelector('.values-pagination');
            if (pagination) {
                const dots = pagination.querySelectorAll('.values-pagination__dot');
                dots.forEach((dot, index) => {
                    // 기존 이벤트 제거 후 재등록
                    dot.replaceWith(dot.cloneNode(true));
                });
                const newDots = pagination.querySelectorAll('.values-pagination__dot');
                newDots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        goToSlide(index);
                    });
                });
            }
        }, 250);
    });
}

// Talent Section 자동 확장 (5초 간격)
function initTalentAutoExpand() {
    const section = document.querySelector('.talent-section');
    if (!section) {
        return;
    }

    // 1450px 이하에서는 슬라이더 모드이므로 자동 확장 비활성화
    const currentWidth = window.innerWidth;
    if (currentWidth <= 1450) {
        return;
    }

    // .talent-grid 내부의 .talent-item만 선택 (슬라이더 제외)
    const talentGrid = section.querySelector('.talent-grid');
    if (!talentGrid) {
        return;
    }

    const talentItems = talentGrid.querySelectorAll('.talent-item');
    if (talentItems.length === 0) {
        return;
    }

    let currentIndex = 0;
    let autoExpandTimeout = null;
    let cycleStartTime = null;
    let isAutoExpandActive = false; // 자동 확장 활성화 상태 추적
    const cycleDuration = 3000; // 3초

    // active 클래스 제거
    const removeActive = () => {
        talentItems.forEach(item => {
            item.classList.remove('active');
        });
    };

    // 다음 카드 활성화
    const activateNext = () => {
        removeActive();
        talentItems[currentIndex].classList.add('active');
        currentIndex = (currentIndex + 1) % talentItems.length;
        cycleStartTime = Date.now();
    };

    // 자동 확장 시작
    const startAutoExpand = () => {
        // 1450px 이하일 때는 자동 확장 비활성화
        if (window.innerWidth <= 1450) {
            stopAutoExpand();
            return;
        }

        // 이미 활성화되어 있으면 스킵
        if (isAutoExpandActive && autoExpandTimeout) {
            return;
        }

        stopAutoExpand();
        isAutoExpandActive = true;
        
        // 남은 시간 계산
        let delay = cycleDuration;
        if (cycleStartTime) {
            const elapsed = Date.now() - cycleStartTime;
            delay = Math.max(0, cycleDuration - elapsed);
        }
        
        autoExpandTimeout = setTimeout(() => {
            if (window.innerWidth > 1450) { // 다시 확인
                activateNext();
                startAutoExpand(); // 재귀적으로 계속 실행
        } else {
                isAutoExpandActive = false;
            }
        }, delay);
    };

    // 자동 확장 정지
    const stopAutoExpand = () => {
        if (autoExpandTimeout) {
            clearTimeout(autoExpandTimeout);
            autoExpandTimeout = null;
            isAutoExpandActive = false;
        }
    };

    // 각 카드에 hover 이벤트
    talentItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            stopAutoExpand();
            removeActive();
            item.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            // 현재 활성화된 카드의 인덱스 찾기
            const activeIndex = Array.from(talentItems).indexOf(item);
            if (activeIndex !== -1) {
                currentIndex = (activeIndex + 1) % talentItems.length;
            }
            startAutoExpand();
        });
    });

    // 섹션 전체에 hover 이벤트 (카드 외부 영역)
    section.addEventListener('mouseenter', stopAutoExpand);
    section.addEventListener('mouseleave', () => {
        startAutoExpand();
    });

    // 리사이즈 이벤트 처리
    let resizeTimer;
    let lastResizeWidth = window.innerWidth;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const currentWidth = window.innerWidth;
            
            // 너무 자주 호출되는 것을 방지 (10px 이상 변경 시에만)
            if (Math.abs(currentWidth - lastResizeWidth) < 10 && currentWidth > 1450) {
                return;
            }
            lastResizeWidth = currentWidth;
            
            if (currentWidth <= 1450) {
                // 슬라이더 모드로 전환 시 자동 확장 정지
                stopAutoExpand();
            } else {
                // 데스크톱 모드로 전환 시 자동 확장 재시작
                if (talentItems.length > 0) {
                    // 현재 활성화된 카드가 없으면 첫 번째 카드 활성화
                    const activeItem = talentGrid.querySelector('.talent-item.active');
                    if (!activeItem) {
                        activateNext();
                    }
                    // 이미 실행 중이 아니면 시작
                    if (!isAutoExpandActive) {
                        startAutoExpand();
                    }
                }
            }
        }, 200);
    };

    window.addEventListener('resize', handleResize);
    
    // 초기 실행 (1450px 초과일 때만)
    setTimeout(() => {
        const currentWidth = window.innerWidth;
        if (currentWidth > 1450) {
            activateNext();
            startAutoExpand();
        }
    }, 300);
}

// Talent Section 슬라이더 초기화 (1450px 이하)
function initTalentSlider() {
    const section = document.querySelector('.talent-section');
    if (!section) {
        return;
    }

    const slider = section.querySelector('.talent-slider');
    const track = section.querySelector('.talent-slider__track');
    const list = section.querySelector('.talent-slider__list');
    const talentGrid = section.querySelector('.talent-grid');
    const paginationDots = section.querySelectorAll('.talent-pagination__dot');

    if (!slider || !track || !list || !talentGrid) {
        return;
    }

    // talent-grid에서 원본 카드 가져오기 (접근성을 위해 원본 유지)
    const originalItems = talentGrid.querySelectorAll('.talent-item');
    
    if (originalItems.length === 0) {
        return;
    }

    const totalItems = originalItems.length; // 실제 카드 개수 (6개)
    
    // 슬라이더 리스트가 비어있으면 원본 카드를 복제하여 추가
    if (list.children.length === 0) {
        originalItems.forEach((item) => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true'); // 접근성: 복제본은 스크린 리더에서 숨김
            list.appendChild(clone);
        });
    }
    
    // 이제 list에서 카드 선택 (복제된 카드)
    const sliderItems = list.querySelectorAll('.talent-item');
    
    // 화면 크기에 따라 보이는 카드 개수 계산
    const getVisibleCards = () => {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 4; // 1450px 이하
    };

    const visibleCards = getVisibleCards();

    // 무한 슬라이드를 위해 앞뒤로 카드 복제 (접근성을 위해 aria-hidden 추가)
    const cloneItems = (items, position) => {
        const clonedItems = [];
        items.forEach((item, index) => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.classList.add('talent-item--clone');
            clonedItems.push(clone);
        });
        return clonedItems;
    };

    // 앞에 복제 카드 추가 (뒤로 가기용)
    const frontClones = cloneItems(Array.from(sliderItems).slice(-visibleCards), 'front');
    frontClones.forEach(clone => {
        list.insertBefore(clone, sliderItems[0]);
    });

    // 뒤에 복제 카드 추가 (앞으로 가기용)
    const backClones = cloneItems(Array.from(sliderItems).slice(0, visibleCards), 'back');
    backClones.forEach(clone => {
        list.appendChild(clone);
    });

    // 모든 카드 다시 선택 (원본 + 복제)
    const talentItems = list.querySelectorAll('.talent-item');
    const totalAllItems = talentItems.length;

    // 초기 위치 설정 (복제된 카드 뒤부터 시작 = visibleCards)
    let currentIndex = visibleCards;
    let isTransitioning = false;
    let autoSlideInterval = null;
    let realIndex = 0; // 실제 인덱스 (페이지네이션용)

    // 슬라이더 위치 업데이트
    const updateSlider = (index, smooth = true, force = false) => {
        // force가 true이거나 smooth가 false일 때는 isTransitioning 체크 무시
        if (!force && isTransitioning && smooth) {
            return;
        }
        
        const firstItem = talentItems[0];
        if (!firstItem) {
            return;
        }
        
        const listStyles = window.getComputedStyle(list);
        const gapValue = listStyles.gap || '16px';
        const gap = parseFloat(gapValue) || 16;
        const visibleCards = getVisibleCards();
        
        // 중앙 정렬을 위한 오프셋 계산
        const trackWidth = track.offsetWidth;
        if (trackWidth === 0) {
            return; // 트랙이 아직 렌더링되지 않음
        }
        
        // active 카드의 실제 위치와 너비 측정
        const activeCard = talentItems[index];
        if (!activeCard) {
            return;
        }
        
        // 정확한 위치 계산 함수
        // active 카드의 크기는 항상 350px로 동일하므로, 이전 카드들의 누적 너비만 정확히 계산하면 됨
        const calculateAndUpdate = () => {
            // 기본 카드 너비 (비활성 상태)
            const defaultCardWidth = 190;
            // active 카드 너비 (활성 상태)
            const activeCardWidth = 350;
            
            // 리스트의 시작점부터 active 카드까지의 거리 계산
            // 이전 카드들은 모두 기본 크기(190px)로 계산
            // (active 클래스가 변경되면 이전 active 카드는 축소되고, 새로운 active 카드는 확장됨)
            let cumulativeLeft = 0;
            for (let i = 0; i < index; i++) {
                const item = talentItems[i];
                if (item) {
                    // 복제된 카드는 항상 기본 크기
                    if (item.classList.contains('talent-item--clone')) {
                        cumulativeLeft += defaultCardWidth + gap;
                    } else {
                        // 실제 카드: active가 아니면 기본 크기, active면 확장 크기
                        // 하지만 index < currentIndex이므로 이전 카드들은 모두 기본 크기여야 함
                        // (현재 active 카드가 index이므로, 그 이전 카드들은 active가 아님)
                        cumulativeLeft += defaultCardWidth + gap;
                    }
                }
            }
            
            // active 카드의 중앙 위치 (리스트의 시작점 기준)
            const activeCardCenterPosition = cumulativeLeft + activeCardWidth / 2;
            
            // 트랙의 중앙 위치
            const trackCenterPosition = trackWidth / 2;
            
            // active 카드의 중앙이 트랙의 중앙에 오도록 translateX 계산
            const newTranslateX = -activeCardCenterPosition + trackCenterPosition;
            
            // transition 설정
            if (smooth) {
                list.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                list.style.transition = 'none';
            }
            
            // transform 적용
            list.style.transform = `translateX(${newTranslateX}px)`;
            
            // Pagination 업데이트 (실제 인덱스 기준)
            paginationDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === realIndex);
            });
        };
        
        // 즉시 계산 (크기 변화는 CSS transition으로 처리되므로, 계산은 고정값 사용)
        requestAnimationFrame(() => {
            calculateAndUpdate();
        });
    };

    // 다음 슬라이드
    const nextSlide = () => {
        if (isTransitioning) {
            return;
        }
        
        isTransitioning = true;
        currentIndex++;
        realIndex = (realIndex + 1) % totalItems;
        
        // active 클래스 업데이트 (확장된 카드 표시, 복제된 카드 제외)
        talentItems.forEach((item, index) => {
            if (!item.classList.contains('talent-item--clone')) {
                item.classList.remove('active');
                if (index === currentIndex) {
                    item.classList.add('active');
                }
            }
        });
        
        // active 클래스 적용 후 약간의 지연을 주고 슬라이더 업데이트
        setTimeout(() => {
            // 마지막 실제 카드에 도달하면 복제된 카드로 이동
            if (currentIndex >= totalItems + visibleCards) {
                // 복제된 카드 위치로 이동 (애니메이션)
                updateSlider(currentIndex, true, true);
                // 애니메이션 완료 후 순간적으로 원래 위치로 이동
                setTimeout(() => {
                    list.style.transition = 'none';
                    currentIndex = visibleCards;
                    realIndex = 0;
                    
                    // active 클래스 업데이트
                    talentItems.forEach((item, index) => {
                        item.classList.remove('active');
                        if (index === currentIndex) {
                            item.classList.add('active');
                        }
                    });
                    
                    updateSlider(currentIndex, false, true);
                    // 다음 프레임에서 애니메이션 재개
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 50);
                }, 500);
            } else {
                updateSlider(currentIndex, true, true);
                setTimeout(() => {
                    isTransitioning = false;
                }, 500);
            }
        }, 10); // active 클래스 적용 후 약간의 지연
    };

    // 이전 슬라이드
    const prevSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentIndex--;
        realIndex = (realIndex - 1 + totalItems) % totalItems;
        
        // active 클래스 업데이트 (확장된 카드 표시, 복제된 카드 제외)
        talentItems.forEach((item, index) => {
            if (!item.classList.contains('talent-item--clone')) {
                item.classList.remove('active');
                if (index === currentIndex) {
                    item.classList.add('active');
                }
            }
        });
        
        // active 클래스 적용 후 약간의 지연을 주고 슬라이더 업데이트
        setTimeout(() => {
            // 첫 번째 실제 카드에 도달하면 복제된 카드로 이동
            if (currentIndex < visibleCards) {
                // 복제된 카드 위치로 이동 (애니메이션)
                updateSlider(currentIndex, true, true);
                // 애니메이션 완료 후 순간적으로 원래 위치로 이동
                setTimeout(() => {
                    list.style.transition = 'none';
                    currentIndex = totalItems + visibleCards - 1;
                    realIndex = totalItems - 1;
                    
                    // active 클래스 업데이트
                    talentItems.forEach((item, index) => {
                        item.classList.remove('active');
                        if (index === currentIndex) {
                            item.classList.add('active');
                        }
                    });
                    
                    updateSlider(currentIndex, false, true);
                    // 다음 프레임에서 애니메이션 재개
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 50);
                }, 500);
            } else {
                updateSlider(currentIndex, true, true);
                setTimeout(() => {
                    isTransitioning = false;
                }, 500);
            }
        }, 10); // active 클래스 적용 후 약간의 지연
    };

    // 특정 슬라이드로 이동 (페이지네이션용)
    const goToSlide = (targetRealIndex) => {
        if (isTransitioning || targetRealIndex === realIndex) {
            return;
        }
        
        isTransitioning = true;
        
        // 실제 인덱스 업데이트
        realIndex = targetRealIndex;
        
        // 현재 인덱스를 실제 카드 영역으로 조정
        const currentRealIndex = (currentIndex - visibleCards + totalItems) % totalItems;
        const diff = (targetRealIndex - currentRealIndex + totalItems) % totalItems;
        
        // 가장 가까운 경로로 이동
        if (diff > totalItems / 2) {
            // 뒤로 가는 것이 더 가까움
            currentIndex = currentIndex - (totalItems - diff);
        } else {
            // 앞으로 가는 것이 더 가까움
            currentIndex = currentIndex + diff;
        }
        
        // 실제 카드 영역으로 조정
        currentIndex = visibleCards + realIndex;
        
        // active 클래스 업데이트 (확장된 카드 표시, 복제된 카드 제외)
        talentItems.forEach((item, index) => {
            if (!item.classList.contains('talent-item--clone')) {
                item.classList.remove('active');
                if (index === currentIndex) {
                    item.classList.add('active');
                }
            }
        });
        
        // active 클래스 적용 후 약간의 지연을 주고 슬라이더 업데이트
        setTimeout(() => {
            updateSlider(currentIndex, true, true);
            
            // 자동 슬라이드 재시작
            stopAutoSlide();
            setTimeout(() => {
                isTransitioning = false;
                startAutoSlide();
            }, 500);
        }, 10); // active 클래스 적용 후 약간의 지연
    };

    // 자동 슬라이드
    const startAutoSlide = () => {
        // 1450px 초과일 때는 자동 슬라이드 비활성화
        if (window.innerWidth > 1450) {
            stopAutoSlide();
            return;
        }
        
        // 이미 실행 중이면 스킵
        if (autoSlideInterval) {
            return;
        }
        
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // 5초마다 자동 슬라이드
    };

    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    };

    // 마우스 호버 시 자동 슬라이드 정지
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', () => {
        // 1450px 이하일 때만 자동 슬라이드 재시작
        if (window.innerWidth <= 1450) {
            startAutoSlide();
        }
    });

    // Pagination dots 클릭 이벤트
    paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // 터치 이벤트 (모바일)
    let touchStartX = 0;
    let touchEndX = 0;

    list.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    list.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    // 슬라이더 초기화 및 활성화 함수
    let initAttempts = 0;
    const maxInitAttempts = 30;
    
    const initAndStart = () => {
        const currentWidth = window.innerWidth;
        
        // 1450px 초과일 때는 슬라이더 비활성화
        if (currentWidth > 1450) {
            stopAutoSlide();
            initAttempts = 0;
            return;
        }

        // 최대 재시도 횟수 초과 시 중단
        if (initAttempts >= maxInitAttempts) {
            initAttempts = 0;
            return;
        }

        const firstItem = talentItems[0];
        if (!firstItem) {
            // 요소가 없으면 재시도
            initAttempts++;
            setTimeout(initAndStart, 200);
            return;
        }

        // 카드가 렌더링될 때까지 대기
        if (firstItem.offsetWidth === 0) {
            initAttempts++;
            setTimeout(initAndStart, 200);
            return;
        }
        
        // 슬라이더 위치 설정 (복제된 카드 뒤부터 시작)
        currentIndex = visibleCards;
        realIndex = 0;
        isTransitioning = false; // 초기화 시 전환 상태 리셋
        
        // 첫 번째 실제 카드에 active 클래스 추가 (확장 상태, 복제된 카드 제외)
        talentItems.forEach((item, index) => {
            if (!item.classList.contains('talent-item--clone')) {
                item.classList.remove('active');
                if (index === visibleCards) {
                    item.classList.add('active');
                }
            }
        });
        
        updateSlider(currentIndex, false, true);
        initAttempts = 0; // 성공 시 리셋
        
        // 자동 슬라이드 시작
        setTimeout(() => {
            if (window.innerWidth <= 1450 && !autoSlideInterval) {
                startAutoSlide();
            }
        }, 1000); // 800ms → 1000ms로 증가하여 초기화 완료 대기
    };

    // 리사이즈 이벤트 처리
    let resizeTimer;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const currentWidth = window.innerWidth;
            
            if (currentWidth <= 1450) {
                // 1450px 이하일 때 슬라이더 활성화
                const firstItem = talentItems[0];
                if (firstItem && firstItem.offsetWidth > 0) {
                    // 리사이즈 시 visibleCards 재계산
                    const newVisibleCards = getVisibleCards();
                    if (newVisibleCards !== visibleCards) {
                        // visibleCards가 변경되면 위치 재조정
                        currentIndex = newVisibleCards + realIndex;
                    }
                    
                    // 위치 재계산
                    isTransitioning = false; // 리사이즈 시 전환 상태 리셋
                    updateSlider(currentIndex, false, true);
                    
                    // 자동 슬라이드가 실행 중이 아니면 시작
                    if (!autoSlideInterval) {
                        startAutoSlide();
                    }
                } else {
                    // 아직 렌더링되지 않았으면 초기화 시도
                    initAttempts = 0; // 리셋 후 재시도
                    initAndStart();
                }
            } else {
                // 1450px 초과일 때 슬라이더 비활성화
                stopAutoSlide();
            }
        }, 200);
    };

    window.addEventListener('resize', handleResize);

    // 초기 로드 시 슬라이더 활성화
    const initOnLoad = () => {
        const currentWidth = window.innerWidth;
        if (currentWidth <= 1450) {
            initAttempts = 0; // 리셋 후 초기화
            initAndStart();
        }
    };

    // 페이지 로드 완료 후 초기화 (이미 DOMContentLoaded에서 호출되므로 바로 실행)
    setTimeout(() => {
        initOnLoad();
    }, 600);
    
    // 리사이즈 이벤트도 즉시 한 번 실행
    setTimeout(() => {
    handleResize();
    }, 800);
}

// 말줄임표가 적용된 타이틀에 툴팁 추가
function initEllipsisTooltips() {
    const updateTooltips = () => {
        // 활성화된 패널 내의 타이틀만 확인 (display: none인 요소는 scrollWidth가 0이 될 수 있음)
        const activePanel = document.querySelector('.tab-panel.active');
        if (activePanel) {
            const titles = activePanel.querySelectorAll('.board-item__title');
            titles.forEach(title => {
                // 텍스트가 잘렸는지 확인
                if (title.scrollWidth > title.clientWidth) {
                    // 원본 텍스트를 title 속성으로 추가
                    title.setAttribute('title', title.textContent.trim());
                } else {
                    title.removeAttribute('title');
                }
            });
        } else {
            // 활성 패널이 없으면 모든 타이틀 확인 (초기 로드 시)
            const titles = document.querySelectorAll('.board-item__title');
            titles.forEach(title => {
                // 부모 패널이 보이는지 확인
                const panel = title.closest('.tab-panel');
                if (panel && (panel.classList.contains('active') || window.getComputedStyle(panel).display !== 'none')) {
                    if (title.scrollWidth > title.clientWidth) {
                        title.setAttribute('title', title.textContent.trim());
                    } else {
                        title.removeAttribute('title');
                    }
                }
            });
        }
    };

    // 초기 실행 (약간의 지연을 두어 렌더링 완료 후 실행)
    setTimeout(updateTooltips, 100);

    // 리사이즈 시 다시 확인
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateTooltips, 250);
    });

    // 탭 전환 시에도 업데이트
    const tabButtons = document.querySelectorAll('.tab-btn[role="tab"]');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(updateTooltips, 50);
        });
    });

    // 전역 함수로 노출 (다른 곳에서도 호출 가능)
    window.updateEllipsisTooltips = updateTooltips;
}

// Footer 드롭다운 메뉴 초기화
function initFooterDropdowns() {
    const dropdowns = document.querySelectorAll('.footer-dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-btn');
        const linkList = dropdown.querySelector('.link-list');
        
        if (!button || !linkList) {
            return;
        }
        
        // 버튼 클릭 시 드롭다운 토글
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = dropdown.classList.contains('active');
            
            // 다른 드롭다운 닫기
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                    const otherButton = otherDropdown.querySelector('.dropdown-btn');
                    if (otherButton) {
                        otherButton.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // 현재 드롭다운 토글
            if (isActive) {
                dropdown.classList.remove('active');
                button.setAttribute('aria-expanded', 'false');
            } else {
                dropdown.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });
    
    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.footer-dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const button = dropdown.querySelector('.dropdown-btn');
                if (button) {
                    button.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
}

// 로고 SVG 텍스트 색상 변경 (앰블럼은 유지, 텍스트만 변경)
function initLogoTextColor() {
    const logoImg = document.querySelector('.new-logo-image img');
    if (!logoImg || logoImg.tagName !== 'IMG') return;
    
    // 이미 SVG가 인라인으로 삽입되어 있으면 스킵
    if (logoImg.parentElement.querySelector('.new-logo-svg')) return;
    
    const logoImageContainer = logoImg.parentElement;
    
    // 이미지 로드 완료 후 실행
    const loadSVG = () => {
        // 1280px 이하에서만 작동
        if (window.innerWidth > 1280) {
            // 데스크톱에서는 기존 SVG 제거
            const existingSvg = logoImageContainer.querySelector('.new-logo-svg');
            if (existingSvg) {
                existingSvg.remove();
                logoImg.style.display = '';
            }
            return;
        }
        
        // 이미 SVG가 있으면 스킵
        if (logoImageContainer.querySelector('.new-logo-svg')) return;
        
        // 이미지의 실제 로드된 경로 사용 (브라우저가 자동으로 절대 경로로 변환)
        let logoSrc = logoImg.src || logoImg.getAttribute('src');
        
        // 상대 경로인 경우 절대 경로로 변환
        if (!logoSrc.startsWith('http') && !logoSrc.startsWith('/')) {
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            logoSrc = basePath + '/' + logoSrc;
        } else if (logoSrc.startsWith('assets/')) {
            logoSrc = '/' + logoSrc;
        }
        
        // 대소문자 구분 문제 해결: logo.svg -> Logo.svg
        if (logoSrc.includes('/logo.svg')) {
            logoSrc = logoSrc.replace('/logo.svg', '/Logo.svg');
        }
        
        // SVG 파일을 fetch하여 인라인으로 삽입
        fetch(logoSrc)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(svgText => {
                // SVG를 인라인으로 삽입
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                const svgElement = svgDoc.querySelector('svg');
                
                if (svgElement) {
                    // 기존 img 태그 숨기기
                    logoImg.style.display = 'none';
                    
                    // SVG 요소 준비
                    svgElement.setAttribute('class', 'new-logo-svg');
                    svgElement.setAttribute('width', '167');
                    svgElement.setAttribute('height', '48');
                    svgElement.style.height = '40px';
                    svgElement.style.width = 'auto';
                    svgElement.style.display = 'block';
                    
                    // 텍스트 부분만 선택하여 클래스 추가
                    const textPaths = svgElement.querySelectorAll('path[fill="#231815"]');
                    textPaths.forEach(path => {
                        path.setAttribute('class', 'new-logo-text-path');
                    });
                    
                    // SVG 삽입
                    logoImageContainer.insertBefore(svgElement, logoImg);
                }
            })
            .catch(error => {
                console.error('로고 SVG 로드 실패:', error, '경로:', logoSrc);
            });
    };
    
    // 이미지가 이미 로드되어 있으면 바로 실행, 아니면 로드 대기
    if (logoImg.complete) {
        loadSVG();
    } else {
        logoImg.addEventListener('load', loadSVG, { once: true });
    }
    
    // 리사이즈 시에도 처리
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const existingSvg = logoImageContainer.querySelector('.new-logo-svg');
            if (window.innerWidth > 1280 && existingSvg) {
                // 데스크톱으로 변경 시 SVG 제거
                existingSvg.remove();
                logoImg.style.display = '';
            } else if (window.innerWidth <= 1280 && !existingSvg) {
                // 모바일로 변경 시 SVG 삽입
                loadSVG();
            }
        }, 250);
    });
}

// 게시판 날짜 형식 변경 (768px 이하에서 "2025.03" → "25.03")
function initBoardDateFormat() {
    function formatBoardDates() {
        const isMobile = window.innerWidth <= 768;
        const monthElements = document.querySelectorAll('.board-item__month');
        const dateSmallElements = document.querySelectorAll('.board-item__date-small');
        
        // board-item__month 처리
        monthElements.forEach(element => {
            const originalText = element.dataset.originalText || element.textContent.trim();
            if (!element.dataset.originalText) {
                element.dataset.originalText = originalText;
            }
            
            if (isMobile) {
                // "2025.03" → "25.03"
                const formatted = originalText.replace(/^20(\d{2}\.\d{2})$/, '$1');
                element.textContent = formatted;
            } else {
                // 원본 텍스트로 복원
                element.textContent = originalText;
            }
        });
        
        // board-item__date-small 처리
        dateSmallElements.forEach(element => {
            const originalText = element.dataset.originalText || element.textContent.trim();
            if (!element.dataset.originalText) {
                element.dataset.originalText = originalText;
            }
            
            if (isMobile) {
                // "2025.02.26" → "25.02.26"
                const formatted = originalText.replace(/^20(\d{2}\.\d{2}\.\d{2})$/, '$1');
                element.textContent = formatted;
            } else {
                // 원본 텍스트로 복원
                element.textContent = originalText;
            }
        });
    }
    
    // 초기 실행
    formatBoardDates();
    
    // 리사이즈 이벤트 처리
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(formatBoardDates, 100);
    });
}

