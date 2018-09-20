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
        						        <p>{{ banner.description }}</p>
        						    </div>   
        						</div>
        					</div>
        				</slick>
        			</div>
        		</div>
        		<div class="site_container">
        		    <div class="home_page_title_container">
        		        <h5 class="home_page_subtitle center caps">Discover {{ property.name }}</h5>
        		        <h3 class="home_page_title caps">What's Happening</h3>
        		    </div>
        		    <div v-masonry transition-duration="0.3s" item-selector=".grid-item" class="hidden_phone">
                        <div v-masonry-tile class="item" >
                            <div v-for="feature in feature_items" :class="'grid-item ' + feature.masonry_class ">
                        	    <div class="feature_item_container">
                        	        <a :href="feature.url">
                            			<img :src="feature.image_url" alt="name">
                            			<div class="feature_item_info" v-if="feature.name && feature.description ">
                            				<div class="feature_item_content">
                            					<p v-if="locale=='en-ca'">{{ feature.name }}</p>
                            					<p v-else>{{ feature.name_2 }}</p>
                            					<h3 v-if="locale=='en-ca'">{{ feature.description }}</h3>
                            					<h3 v-else>{{ feature.description_2 }}</h3>
                            					<div v-if="lastItem(feature)" class="feature_item_more">
                            					    {{ $t("home_page.subscribe") }}    
                            					</div>
                            					<div v-else class="feature_item_more">
                            					    {{ $t("home_page.read_more") }}    
                            					</div>
                            				</div>
                            			</div>
                            		</a>
                        	    </div>
                            </div>
                        </div>
                    </div>
                    <div v-masonry transition-duration="0.3s" item-selector=".grid-item" class="visible_phone">
                        <div v-masonry-tile class="item" >
                            <div v-for="feature in mobile_feature_items" :class="'grid-item ' + feature.masonry_class ">
                            	<div class="feature_item_container">
                        	        <a :href="feature.url">
                            			<img :src="feature.image_url" alt="name">
                            			<div class="feature_item_info" v-if="feature.name && feature.description ">
                            				<div :class="'feature_item_content ' + feature.text_class + feature.border">
                            					<p v-if="locale=='en-ca'">{{ feature.name }}</p>
                            					<p v-else>{{ feature.name_2 }}</p>
                            					<h3 v-if="locale=='en-ca'">{{ feature.description }}</h3>
                            					<h3 v-else>{{ feature.description_2 }}</h3>
                            				</div>
                            			</div>
                            		</a>
                        	    </div>
                            </div>
                        </div>
                    </div>
                    <div class="home_page_title_container">
        		        <h5 class="home_page_subtitle center caps">Programs</h5>
        		        <h3 class="home_page_title caps">Kids Club & Southland Scoop</h3>
        		    </div>
        		    <div class="row">
        		        <div v-for="feature in programs" class="col-sm-6">
        		            <div class="feature_item_container">
                    			<img :src="feature.image_url" alt="name">
                    			<div class="feature_item_info"> <!-- v-if="feature.name && feature.description " -->
                    				<div class="feature_item_content">
                    					<p>{{ feature.name }}</p>
                    					<h3>{{ feature.description }}</h3>
                    					<a :href="feature.url">
                        					<div class="feature_item_more">Read More</div>
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
    define(["Vue", "vuex", "vue!today_hours", "vue!search-component", 'vue!vue-slick', 'js-cookie', 'masonry' , 'vue-masonry-plugin'], function(Vue, Vuex, TodayHoursComponent, SearchComponent, slick, Cookies, masonry, VueMasonryPlugin) {
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
                    }
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
                mobile_feature_items () {
                    var features = this.$store.state.feature_items;
                    _.forEach(features, function(value, key) {
                        if ( _.includes([1], key) ) {
                            value.masonry_class = "grid-item--width2";
                            value.text_class = " ";
                            value.border = " ";
                        } else if ( _.includes([2], key) ){
                            value.masonry_class = "grid-item--width2";
                            value.text_class = "add_black";
                            value.border = " ";
                        } else if ( _.includes([3], key) ){
                            value.masonry_class = "grid-item--height2";
                            value.text_class = " ";
                            value.border = " ";
                        } else if ( _.includes([4], key) ){
                            value.text_class = " ";
                            value.border = "full_border";
                        } else if ( _.includes([5], key) ){
                            value.text_class = "add_black";
                            value.border = " ";
                            value.last_item = true;
                        } else {
                            value.masonry_class = " ";
                            value.text_class = " ";
                            value.border = " ";
                            value.last_item = false;
                        }
                    });
                    features = _.sortBy(features, [function(o) { return o.mobile_order; }]);
                    return features;
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

                lastItem(feature){
                    if(feature.last_item == true){
                        return true
                    }
                }
            }
        })
    })
</script>