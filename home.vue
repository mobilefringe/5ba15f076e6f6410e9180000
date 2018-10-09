<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="banner_div">
        			<div class="home_banner_container">
        				<slick ref="slick" :options="slickOptions">
        					<div class="" v-for="banner in banners" v-if="banners">
        						<div class="home_banner" v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }">
        						    <div class="home_banner_content" v-if="banner.name && banner.description">
        						        <h1>{{ banner.name }}</h1>
        						        <h2>{{ banner.description }}</h2>
        						    </div>   
        						</div>
        					</div>
        				</slick>
        			</div>
        		</div>
        		<div class="site_container">
        		    <div class="visible_phone">
        		        <div class="home_page_title_container">
            		        <h5 class="home_page_subtitle center caps">Discover {{ property.name }}</h5>
            		        <h3 class="home_page_title caps">Find Your Store</h3>
            		    </div>
            		    <div class="margin_30">
                            <div class="map_search_container">
                                <search-component v-model="storeSearch" :list="processedStores" :suggestion-attribute="suggestionAttribute" @select="onOptionSelect" :placeholder="$t('stores_page.find_your_store')">
                                    <template slot="item" scope="option">
                                        <article class="media"><p>{{ option.data.name }}</p></article>
                                    </template>
                                </search-component>
                                <i id="store_search_icon" class="fa fa-search" aria-hidden="true"></i>
                            </div>
                        </div>
                        <mapplic-map ref="mapplic_ref" :height="556" :minimap= "false" :deeplinking="false" :sidebar="false" :hovertip="true" :maxscale= "5" :storelist="allStores" :floorlist="floorList" tooltiplabel="View Store Details"></mapplic-map>
        		    </div>
        		    <div class="home_page_title_container">
        		        <h5 class="home_page_subtitle center caps">Discover {{ property.name }}</h5>
        		        <h3 class="home_page_title caps">What's Happening</h3>
        		    </div>
        		    <div v-masonry transition-duration="0.3s" item-selector=".grid-item" > <!-- class="hidden_phone" -->
                        <div v-masonry-tile class="item">
                            <div v-for="feature in feature_items" :class="'grid-item ' + feature.masonry_class ">
                        	    <div v-if="feature.name && feature.description" class="feature_item_container">
                        	        <a :href="feature.url">
                            			<img :src="feature.image_url" alt="">
                            			<div class="feature_item_info" >
                            				<div class="feature_item_content">
                            					<p>{{ feature.name }}</p>
                            					<h3>{{ feature.description }}</h3>
                            					<div class="feature_item_more" :aria-label="feature.name">View Details</div>
                            				</div>
                            			</div>
                            		</a>
                        	    </div>
                        	    <div v-else class="feature_item_container">
                        	        <a :href="feature.url">
                            			<img :src="feature.image_url" :alt="feature.name">
                            			<div class="feature_item_info"></div>
                            		</a>
                        	    </div>
                            </div>
                        </div>
                    </div>
                    <!--<div v-masonry transition-duration="0.3s" item-selector=".grid-item" class="visible_phone">-->
                    <!--    <div v-masonry-tile class="item">-->
                    <!--        <div v-for="feature in feature_items" :class="'grid-item ' + feature.masonry_class ">-->
                    <!--    	    <div v-if="feature.name && feature.description" class="feature_item_container">-->
                    <!--    	        <a :href="feature.url">-->
                    <!--        			<img :src="feature.image_url" :alt="feature.name">-->
                    <!--        			<div class="feature_item_info" >-->
                    <!--        				<div class="feature_item_content">-->
                    <!--        					<p>{{ feature.name }}</p>-->
                    <!--        					<h3>{{ feature.description }}</h3>-->
                    <!--        					<div class="feature_item_more" :aria-label="feature.name">View Details</div>-->
                    <!--        				</div>-->
                    <!--        			</div>-->
                    <!--        		</a>-->
                    <!--    	    </div>-->
                    <!--    	    <div v-else class="feature_item_container">-->
                    <!--    	        <a :href="feature.url">-->
                    <!--        			<img :src="feature.image_url" :alt="feature.name">-->
                    <!--        			<div class="feature_item_info"></div>-->
                    <!--        		</a>-->
                    <!--    	    </div>-->
                    <!--        </div>-->
                    <!--    </div>-->
                    <!--</div>-->
                    <div class="home_page_title_container">
        		        <h5 class="home_page_subtitle center caps">Programs</h5>
        		        <h3 class="home_page_title caps">Kids Club & Southland Scoop</h3>
        		    </div>
        		    <div class="row">
        		        <div v-for="feature in programs" class="col-sm-6">
        		            <div class="feature_item_container programs">
                    			<img :src="feature.image_url" alt="">
                    			<div class="feature_item_info"> <!-- v-if="feature.name && feature.description " -->
                    				<div class="feature_item_content">
                    					<p>{{ feature.name }}</p>
                    					<h3>{{ feature.description }}</h3>
                    					<a :href="feature.url" :aria-label="feature.name">
                        					<div class="feature_item_more animated_btn">View Details</div>
                        				</a>
                    				</div>
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
    define(["Vue", "vuex", "vue!today_hours", "vue!search-component", 'vue!vue-slick', 'js-cookie', 'masonry' , 'vue-masonry-plugin', "vue!mapplic-map"], function(Vue, Vuex, TodayHoursComponent, SearchComponent, slick, Cookies, masonry, VueMasonryPlugin, MapplicComponent) {
        Vue.use(VueMasonryPlugin.default);
        return Vue.component("home-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    show_popup: false,
                    popup: null,
                    slickOptions: {
                        arrows: false,
                        autoplay: true,
                        autoplaySpeed: 6000,
                        cssEase: 'linear',
                        dots: true,
                        fade: true,
                        infinite: true,
                        slidesToShow: 1,
                        speed: 1200
                    },
                    suggestionAttribute: "name",
                    storeSearch: null,
                }
            },
            created () {
                this.loadData().then(response => {
                    // this.popup = this.$store.state.popups[0];
                    
                    this.dataLoaded = true;
                });
            },
            watch : {
                dataLoaded () {
                    var viewed = Cookies.get('popup_viewed');
                    if(this.popup !== null && viewed !== "true") {
                        Cookies.set('popup_viewed', "true");
                        viewed = Cookies.get('popup_viewed');
                        this.show_popup = true;
                        this.popup.image_url = "//mallmaverick.cdn.speedyrails.net" + this.popup.photo_url;
                        document.getElementById('popup_backdrop').style.display = "block";
                    } else {
                        document.getElementById('popup_backdrop').style.display = "none";
                    }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores'
                ]),
                banners () {
                    return _.orderBy(this.$store.state.banners, ['position'], ['asc']);
                },
                feature_items () {
                    var features = _.slice(this.$store.state.feature_items, 0, 6);
                    _.forEach(features, function(value, key) {
                        if ( _.includes([1], key) ) {
                            value.masonry_class = "grid-item--width2";
                        } else if ( _.includes([2], key) ){
                            value.masonry_class = "grid-item--width2";
                        } else if ( _.includes([3], key) ){
                            value.masonry_class = "grid-item--height2";
                        } else {
                            value.masonry_class = " ";
                        }
                    });
                    return features;
                },
                programs () {
                    var features = _.slice(this.$store.state.feature_items, 6, 8);  
                    return features
                },
                // mobile_feature_items () {
                //     var features = _.slice(this.$store.state.feature_items, 0, 6);
                //     _.forEach(features, function(value, key) {
                //         if ( _.includes([1], key) ) {
                //             value.masonry_class = "grid-item--width2";
                //             value.text_class = " ";
                //             value.border = " ";
                //         } else if ( _.includes([2], key) ){
                //             value.masonry_class = "grid-item--width2";
                //             value.text_class = "add_black";
                //             value.border = " ";
                //         } else if ( _.includes([3], key) ){
                //             value.masonry_class = "grid-item--height2";
                //             value.text_class = " ";
                //             value.border = " ";
                //         } else if ( _.includes([4], key) ){
                //             value.text_class = " ";
                //             value.border = "full_border";
                //         } else if ( _.includes([5], key) ){
                //             value.text_class = "add_black";
                //             value.border = " ";
                //             value.last_item = true;
                //         } else {
                //             value.masonry_class = " ";
                //             value.text_class = " ";
                //             value.border = " ";
                //             value.last_item = false;
                //         }
                //     });
                //     features = _.sortBy(features, [function(o) { return o.mobile_order; }]);
                //     return features;
                // }
                allStores() {
                    var all_stores = this.processedStores;
                    _.forEach(all_stores, function(value, key) {
                        value.zoom = 2;
                    });
                    var initZoom = {};
                    initZoom.svgmap_region = "init";
                    initZoom.z_coordinate = 1;
                    initZoom.x = 0.5;
                    initZoom.y = 0.5;
                    initZoom.zoom = 1;
                    all_stores.push(initZoom)
                    return all_stores
                },
                getSVGMap() {
                    var mapURL = "https://www.mallmaverick.com" + this.property.svgmap_url.split("?")[0];
                    return mapURL
                },
                floorList() {
                    var floor_list = [];
                    var floor_1 = {};
                    floor_1.id = "first-floor";
                    floor_1.title = "Level One";
                    floor_1.map = this.getSVGMap;
                    floor_1.z_index = 1;
                    floor_1.show = true;
                    floor_list.push(floor_1);
                    return floor_list;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "banners"), this.$store.dispatch("getData", "feature_items"), this.$store.dispatch("getData", "popups")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                onOptionSelect(option) {
                    this.$nextTick(function() {
                        this.storeSearch = ""
                    });
                    this.$refs.mapplic_ref.showLocation(option.svgmap_region);
                },
            }
        })
    })
</script>