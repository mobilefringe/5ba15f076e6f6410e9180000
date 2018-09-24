<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{$t("map_page.header_title")}}</h1>
        				</div>
        			</div>
        		</div>  
                <div class="site_container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="alpha_list hidden_phone">
                                <a @click="filterStores('All')" class="all_a">All</a>
                                <a @click="filterStores('#')">#</a>
                                <a v-for="letter in alphabet" @click="filterStores(letter)">{{letter}}</a>
                            </div>
                            <div class="margin_40"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-9 col-md-push-3">
                            <png-map ref="pngmap_ref" :png-map-url="getPNGurl" :initial-position="'700 450'" @updateMap="updatePNGMap"></png-map>
                        </div>
                        <div class="margin-30 visible-mobile"></div>
                        <div class="col-md-3 col-md-pull-9">
                            <div class="map_search_container">
                                <search-component v-model="storeSearch" :list="processedStores" :suggestion-attribute="suggestionAttribute" @select="onOptionSelect" :placeholder="$t('stores_page.find_your_store')">
                                    <template slot="item" scope="option">
                                        <article class="media"><p>{{ option.data.name }}</p></article>
                                    </template>
                                </search-component>
                                <i id="store_search_icon" class="fa fa-search" aria-hidden="true"></i>
                            </div>
                            <div class="store_list">
                                <div class="store_list_container hidden-mobile" v-if="filteredStores">
                                    <div class="store_name" v-for="store in filteredStores">
                                        <p v-on:click="addLandmark(store)">{{store.name}}</p>
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="store_name">
                                        <p>{{ $t("map_page.no_stores") }}</p>
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
<style>
	#png_map{
	    width:1310px;
		height: 983px;
		min-width:1310px;
		min-height: 983px;
	}
</style>
<script>
    define(["Vue", "vuex", "jquery", "smooth-zoom", "vue!png-map"], function(Vue, Vuex, $, smoothZoom, PNGMapComponent) {
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            data: function () {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    alphabet : [
                        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
                    ],
                    suggestionAttribute: "name",
                    storeSearch: null,
                    filteredStores: null,
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Contact Banner');
                    if(temp_repo) {
                        try {
                            this.pageBanner = temp_repo.images[0];
                        } catch(e) {
                            
                        }
                    } else {
                        this.pageBanner = { "image_url": "https://via.placeholder.com/1920x300" }
                    }
                    
                    this.filteredStores = this.processedStores;
                    this.$on('updateMap', this.updatePNGMap);
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    "property",
                    "timezone",
                    "repos",
                    "findRepoByName",
                    "processedStores",
                    'storesByAlphaIndex',
                ]),
                allStores() {
                    return this.processedStores;
                },
                getPNGurl() {
                    return "https://www.mallmaverick.com" + this.property.map_url;
                },
                svgMapRef() {
                    return _.filter(this.$children, function(o) {
                        return (o.$el.className == "svg-map")
                    })[0];
                },
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                filterStores (letter) {
                    if(letter == "All" || letter == undefined || letter == null){
                        this.filteredStores = this.processedStores;
                    } else {
                        var filtered = _.filter(this.storesByAlphaIndex, function(o,i) { return _.lowerCase(i) == _.lowerCase(letter); })[0];
                        this.filteredStores = filtered
                    }
                },
                onOptionSelect(option) {
                    this.$nextTick(function() {
                        this.storeSearch = ""
                    });
                    this.svgMapRef.addMarker(option);
                },
                updatePNGMap(map) {
                    this.map = map;
                    // console.log("in updatepng")
                },
                addLandmark(store) {
                    console.log(store)
                    this.svgMapRef.addMarker(store);
                }
            }
        });
    });
</script>