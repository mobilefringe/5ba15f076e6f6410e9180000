<template>
    <header>
        <div class="sticky">
			<div class="site_container">
				<div class="header_logo">
					<div class="hidden_phone">
					    <div class="social_icons">
                            <span v-for="item in social_media">
                                <a :href="item.url" target="_blank">
                                    <p class="accessibility">{{ item.name }}</p>
                                    <i :class="item.iconClass" aria-hidden="true"></i>
                                </a>
                            </span>
                        </div>
					</div>
					<div class="mobile_header">
					    <div class="property_logo center-block">
							<router-link to="/">
							    <img src="//codecloud.cdn.speedyrails.net/sites/5ba15f076e6f6410e9180000/image/png/1519154972000/mm_logo.png" alt="Property Logo"/>
						    </router-link>
						</div>
				        <div id="menu-icon" @click="showMenu = !showMenu" :class="{ open: showMenu }" class="visible_phone hamburger">
            				<div class="hamburger__line">
            					<span class="hamburger__dots"></span>
            					<span class="hamburger__dots hamburger__dots--right"></span>
            					<span class="hamburger__dots"></span>
            				</div> 
            				<div class="hamburger__line">
            					<span class="hamburger__dots hamburger__dots--up"></span>
            					<span class="hamburger__dots"></span>
            					<span class="hamburger__dots hamburger__dots--down"></span>
            				</div>
            				<div class="hamburger__line">
            					<span class="hamburger__dots"></span>
            					<span class="hamburger__dots hamburger__dots--left"></span>
            					<span class="hamburger__dots"></span>
            				</div> 
            			</div>
					</div>
					<div class="hidden_phone">
					    <div class="header_search_container">
    					    <search-component v-model="search" :list="processedStores" :suggestion-attribute="suggestionAttribute" placeholder="" @select="onOptionSelect">
                                <template slot="item" scope="option">
                                    <article class="media">
                                        <p>{{ option.data.name }}</p>
                                    </article>
                                </template>
                            </search-component>	
                        </div>
					</div>
				</div>
				<div class="row">
				    <div class="col-md-2 hidden_phone"></div>
					<div class="col-sm-12 col-md-8">
						<nav id="primary_nav" class="hidden_phone">
							<ul>
							    <li class="menu_item" v-for="item in menu_items" :id="item.id">
							        <router-link v-if="item.sub_menu == undefined" :to="item.href">{{$t(item.name)}}</router-link>
    						        <span v-if="item.sub_menu != undefined">{{$t(item.name)}}</span>
							        <ul v-if="item.sub_menu">
							            <li v-for="sub_menu in item.sub_menu" class="dropdown_item">
							                <router-link :to="sub_menu.href">{{$t(sub_menu.name)}}</router-link>
							            </li>
									</ul>
							    </li>
							</ul>
						</nav>
					</div>
					<div class="nav_container visible_phone">
					    <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
    					    <nav id="mobile_nav" v-show="showMenu" class="">
    					        <ul>
    					            <li v-for="(item,key) in menu_items" class="menu_item">
    							        <router-link :to="item.href" v-if="item.sub_menu == undefined">{{$t(item.name)}}</router-link>
    							        <div v-else>
    							            <b-card no-body class="mb-1">
                                                <b-card-header header-tag="header" class="p-1" role="tab">
                                                    <b-btn block @click="item.show_sub_menu = !item.show_sub_menu" :class="item.show_sub_menu ? 'collapsed' : null" :aria-controls="$t(item.name)" :aria-expanded="item.show_sub_menu ? 'true' : 'false'">
                                                        {{$t(item.name)}}
                                                        <i v-if="item.show_sub_menu"  class="fa fa-minus"></i>
                                                        <i v-else  class="fa fa-plus"></i>
                                                    </b-btn>
                                                </b-card-header>
                                                <b-collapse v-model="item.show_sub_menu" :id="$t(item.name)" :visible="item.show_sub_menu" :accordion="$t(item.name)" role="tabpanel" class="accordion_body">
                                                    <b-card-body v-for="sub_menu in item.sub_menu">
                                                        <p class="card-text">
                                                            <router-link :to="sub_menu.href">{{$t(sub_menu.name)}}</router-link>
                                                        </p>
                                                    </b-card-body>
                                                </b-collapse>
                                            </b-card>
    							        </div>
    							    </li>
    					        </ul>
    						    <div class="mobile_nav_content visible_phone">
                                    <div class="mobile_address_container center">
                                        <hr>
                                        <a href="https://goo.gl/maps/RJ5dV8dxP1y" target="_blank">
                                            <p class="property_address">{{ property.address1 }},<br>{{ property.city }}, {{ property.province_state }}</p>
                                        </a>
                                        <a :href="'tel:' + property.contact_phone" >
                                            <h5>{{ property.contact_phone }}</h5>
                                        </a>
                                        <hr>
                                    </div>
                                    <div class="social_icons center">
                                        <span v-for="item in social_media">
                                            <a :href="item.url" target="_blank">
                                                <p class="accessibility">{{ item.name }}</p>
                                                <i :class="item.iconClass" aria-hidden="true"></i>
                                            </a>
                                        </span>
                                    </div> 
    							</div>
    						</nav>
    				    </transition>
    				</div>
					<div class="col-md-2 hidden_phone">
					    	
					</div>
				</div>
			</div>
		</div>
    </header>
</template>

<script>
    define(["Vue", "vuex", "vue_router", "routes", "bootstrap-vue"], function (Vue, Vuex, VueRouter, appRoutes, BootstrapVue) {
        Vue.use(BootstrapVue);
        return Vue.component("header-component", {
            template: template, // the variable template will be injected,
            props:['menu_items', 'social_media'],
            data: function () {
                return {
                    suggestionAttribute: 'name',
                    search: '', 
                    showMenu: false,
                    showMobileMenu: false,
                    noScroll: false,
                    windowWidth: 0
                }
            },
            watch: {
                $route: function() {
                    if (this.windowWidth <= 768) {
                        this.showMenu = false;
                    }  
                    _.forEach(this.menu_items, function(value, key) {
                        value.show_sub_menu = false;
                    });
                },
                showMenu: function() {
                    if(this.showMenu == true){
                        document.body.classList.add("no_scroll");
                    } else if (this.showMenu == false) {
                        document.body.classList.remove("no_scroll");
                    }
                }
            },
            created() {
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    this.getWindowWidth();
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores'
                ]),
                locale: {
                    get () {
                        return this.$store.state.locale
                    },
                    set (value) {
                        this.$store.commit('SET_LOCALE', { lang: value })
                    }
                }
            },
            methods: {
                changeLocale: function(val) {
                    // this will update the data store, which in turn will trigger the watcher to update the locale in the system
                    this.locale = val; 
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                },
                onOptionSelect(option) {
                    this.$nextTick(function() {
                        this.search = ""
                    });
                    this.$router.push("/stores/" + option.slug);
                }
            },
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            }
        });
    });
</script>