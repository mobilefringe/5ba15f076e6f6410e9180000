<template>
    <footer v-if="footerBanner" v-bind:style="{ backgroundImage: 'url(' + footerBanner.image_url + ')' }">
		<div class="footer">
			<div class="site_container">
			    <div class="row footer_logo">
			        <div class="col-md-3 center-block">
			            <div class="property_logo">
					        <router-link to="/">
					            <img src="//codecloud.cdn.speedyrails.net/sites/5ba15f076e6f6410e9180000/image/png/1519154972000/mm_logo.png" alt="Property Logo"/>
				            </router-link>
				        </div>    
			        </div>
			        <div class="col-xs-12 visible_phone">
			            <div class="row">
			                <div class="col-xs-4">
			                    <div class="language_select">
					                <span @click="changeLocale('en-ca')">EN</span> | <span @click="changeLocale('fr-ca')">FR</span>
				                </div>    
			                </div>
			                <div class="col-xs-8">
			                    <div class="header_search_container">
                			        <search-component v-model="search" :list="processedStores" :suggestion-attribute="suggestionAttribute" :placeholder="$t('header.search')" @select="onOptionSelect">
                                        <template slot="item" scope="option">
                                            <article class="media">
                                                <p>{{ option.data.name }}</p>
                                            </article>
                                        </template>
                                    </search-component>
                                </div>
			                </div>
			            </div>
			        </div>
			        <div class="col-md-6">
			            <nav id="footer_nav">
    						<ul>
    						    <li v-for="item in footer_menu_items" class="menu_item">
    						        <router-link :to="item.href">{{$t(item.name)}}</router-link>
    						    </li>
    						</ul>
    					</nav>    
			        </div>
			        <div class="col-md-3">
			            <div class="social_icons">
                            <span v-for="item in social_media">
                                <a :href="item.url" target="_blank">
                                    <i :class="item.iconClass" aria-hidden="true"></i>
                                </a>
                            </span>
                        </div>    
			        </div>
			    </div>
				<div class="footer_terms">
					<p>&copy; {{copyright_year}} <span class="caps">{{property.name}}</span> {{$t("footer.all_rights")}} <router-link to="/pages/bonniedoon-privacy-policy">{{$t("footer.privacy_policy")}}</router-link> <span class="hidden_phone">|</span><br class="visible_phone"/><span> {{$t("footer.powered_by")}} <a href="//www.mallmaverick.com" target="_blank">Mall Maverick</a></span></p>
				</div>
			</div>
		</div>
    </footer>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue!search-component"], function (Vue, Vuex, moment, tz, VueMoment, SearchComponent) {
        return Vue.component("footer-component", {
            template: template, // the variable template will be injected,
            data: function data() {
                return {
                    footerBanner: null,
                    suggestionAttribute: 'name',
                    search: '',
                    newsletter_email: "",
                }
            },
            props:['footer_menu_items', 'social_media'],
            created() {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    
                    var temp_repo = this.findRepoByName('Footer Banner');
                    if(temp_repo) {
                        this.footerBanner = temp_repo.images[0];
                    }
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'findRepoByName',
                    'processedStores'
                ]),
                locale: {
                    get () {
                        return this.$store.state.locale
                    },
                    set (value) {
                        this.$store.commit('SET_LOCALE', { lang: value })
                    }
                },
                copyright_year() {
                    return moment().year();
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                changeLocale: function(val) {
                    // this will update the data store, which in turn will trigger the watcher to update the locale in the system
                    this.locale = val; 
                },
                onOptionSelect(option) {
                    console.log('Selected option:', option);
                    this.$nextTick(function() {
                        this.search = ""
                    });
                    this.$router.push("/stores/" + option.slug);
                }
            }
        });
    });
</script>