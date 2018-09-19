<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="page_header" v-if="storeBanner" v-bind:style="{ backgroundImage: 'url(' + storeBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>Shop</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container page_content">
        			<div class="stores_header_container">
    
        				<div class="stores_button_container search position_relative">
        					<search-component :list="allStores" :placeholder="$t('stores_page.find_your_store')" suggestion-attribute="name" v-model="search_result" @select="onOptionSelect" class="text-left">
        						<template slot="item" scope="option" class="manual">
        							<article class="media">
        								<p>{{ option.data.name }}</p>
        							</article>
        						</template>
        					</search-component>
        					<i id="search_icon" class="fa fa-search"></i>
        					<!--<img src="//codecloud.cdn.speedyrails.net/sites/5ba15f076e6f6410e9180000/image/png/1517497861636/search_icon_2x.png" id="search_icon" alt="">-->
        				</div>
        				
        				<div class="stores_button_container map_link">
        				    <router-link to="/map">
        				        View Center Map
        				    </router-link>
        				</div>
        			
        			</div>
        			<div class="row">
        				<div id="store_list_container">
        					<div class="col-xs-6 col-sm-3 col-md-2 cats_row" v-for="store in filteredStores" :data-cat="store.cat_list">
        						<div class="store_logo_container" :id="store.initial">
        							<router-link :to="'/stores/'+ store.slug">
        							    <span v-if="store.hover_img">
            							    <transition name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            								    <img class="store_img" :src="store.store_front_url_abs"/>
            								</transition>
            								<transition name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            								    <img class="store_hover" :src="store.hover_img"/>
            								</transition>
            							</span>
            							<span v-else>
            							    <img class="store_no_hover_img" :src="store.store_front_url_abs"/>    
            							</span>
        								<div class="store_coming_soon" v-if="store.is_coming_soon_store">
        									<div class="new_store">{{$t("stores_page.coming_soon")}}</div>
        								</div>
        								<div class="store_coming_soon" v-if="store.is_new_store">
        									<div class="new_store">{{$t("stores_page.new_store")}}</div>
        								</div>
        							</router-link>
        						</div>
        					</div>
        				</div>
        			</div>
        		</div>
	        </div>
	    </transition>
	</div>
</template>

<script>
    define(["Vue", "vuex", "vue-select", "jquery", "smooth-zoom", "vue!png-map", "vue!search-component"], function(Vue, Vuex, VueSelect, $, smoothZoom, PNGMapComponent, SearchComponent) {
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    storeBanner : null,
                    windowWidth: 0,
                    selectedCat: null,
                    filteredStores: null,
                    search_result : null
                }
            },
            created (){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Stores Banner');
                    if(temp_repo) {
                        this.storeBanner = temp_repo.images[0];
                    }
                    
                    this.dataLoaded = true;
                });
            },
            watch: {
                windowWidth: function() {
                    if (this.windowWidth <= 768) {
                        this.mobile_store = true;
                    } else {
                        this.mobile_store = false;
                    }
                },
            },
            mounted() {
                // this.filteredStores = this.allStores;
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    //Init
                    this.getWindowWidth();
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'processedCategories',
                    'storesByAlphaIndex',
                    'storesByCategoryName',
                    'findCategoryById',
                    'findCategoryByName',
                    'findRepoByName'
                ]),
                allStores() {
                    var store_list = this.processedStores
                    var vm = this;
                    var hover_image = "";
                    _.forEach(store_list, function(value, key) {
                        if(value.assets != undefined){
                            //Stores JSON
                            var store_id = value.id
                            vm.$store.dispatch('LOAD_PAGE_DATA', { url: vm.property.mm_host + "/api/v4/thegateway/stores/" + store_id + "/store_files.json" }).then(response => {
                                if(response.data != undefined) {
                                    hover_image = response.data.store_files[0].url
                                    value.hover_img = 'https://www.mallmaverick.com' + hover_image
                                    vm.filteredStores = null;
                                    vm.filteredStores = store_list; 
                                    vm.filteredStores[key].hover_img = 'https://www.mallmaverick.com' + hover_image
                                }
                            }, error => {
                                console.error("Could not retrieve data from server. Please check internet connection and try again.");
                                vm.$router.replace({ name: 'home' });
                            });
                        }    
                    });
                    this.filteredStores = store_list;
                    return store_list
                },
                allCatergories() {
                    return this.processedCategories;
                },
                dropDownCats() {
                    var cats = _.map(this.processedCategories, 'name');
                    cats.unshift('All');
                    return cats;
                },
                getPNGurl() {
                    return "https://www.mallmaverick.com" + this.property.map_url;
                },
                svgMapRef() {
                    return _.filter(this.$children, function(o) {
                        return (o.$el.className == "svg-map")
                    })[0];
                },
                filterByCategory() {
                    category_id = this.selectedCat;
                    if (category_id == "All" || category_id == null || category_id == undefined) {
                        category_id = "All";
                    } else {
                        category_id = this.findCategoryByName(category_id).id;
                    }

                    if (category_id == "All") {
                        this.filteredStores = this.allStores;
                    } else {
                        var find = this.findCategoryById;
                        var filtered = _.filter(this.allStores, function(o) {
                            return _.indexOf(o.categories, _.toNumber(category_id)) > -1;
                        });
                        this.filteredStores = filtered;
                    }
                    var el = document.getElementById("selectByCat");
                    if(el) {
                        el.classList.remove("open");
                    }
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "categories"), this.$store.dispatch("getData", "repos")]);
                        
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                changeMode(mode) {
                    this.listMode = mode;
                },
                updateSVGMap(map) {
                    this.map = map;
                },
                addLandmark(store) {
                    this.svgMapRef.addMarker(store);
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                },
                onOptionSelect(option) {
                    this.search_result = "";
                    this.$router.push("/stores/"+option.slug);
                }
            },
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            },
        });
    });
</script>