<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + storeBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>Shop</h1>
        				</div>
        			</div>
        		</div>
        		<div class="margin_60"></div>
                <div v-if="dataLoaded" v-cloak class="site_container">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="details_store_name">
                                <h2>{{ currentStore.name }}</h2>
                                <p class="store_category">{{ storeCategory }}</p>
                                <h3 v-if="currentStore.phone" class="store_phone"><span>{{ currentStore.phone }}</span><i class="fa fa-phone"></i></h3>
                                <div class="">
                                    <div class="store_website animated_btn caps">Visit Website</div>
                                    <div class="store_website animated_btn caps">View Map</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
            				<div class="details_store_image">
            				    <div v-if="currentStore.no_logo" class="store_details_image center-block">
                                    <div class="no_logo">
                                        <p class="store_details_name">{{ currentStore.name }}</p>
                                    </div>    
                                </div>
                                <img v-else class="store_details_image center-block" :src="currentStore.store_front_url_abs" :alt="currentStore.name + ' Logo'" />
            				</div>
            			</div>
            		</div>
            		<div class="row">
                        <div class="col-md-5">
            				<div class="details_store_hours">
            				    <h4 class="details_store_title caps">Shopping Hours</h4> 
            				    <ul v-if="storeHours" class="details_store_hours_list">
                                    <li v-for="hour in storeHours" :class="{ today: hour.todays_hours }">
                                        <div v-if="!hour.is_closed">
                                            <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}} </span>{{hour.open_time | moment("h:mma", timezone)}} - {{hour.close_time | moment("h:mma", timezone)}}
                                        </div>
                                        <div v-else>
                                            <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}} </span>CLOSED
                                        </div>
                                    </li>
                                </ul>
            				</div>
            			</div>
            			<div class="col-md-7">
            				<div class="details_store_desc">
            				    <h4 class="details_store_title caps">{{ currentStore.name }}</h4>
            				    <div v-html="currentStore.description"></div>
            				</div>
            			</div>
                    </div>
    		    </div>
    		</div>
		</transition>
	</div>
</template>

<script>
    define(['Vue', 'vuex', 'moment', 'vue-lazy-load'], function(Vue, Vuex, moment, VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("store-details-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    currentStore: null,
                    storeHours: {}
                }
            },
            props:['id', 'locale'],
            beforeRouteUpdate(to, from, next) {
                this.currentStore = this.findStoreBySlug(to.params.id);
                if (this.currentStore === null || this.currentStore === undefined){
                    this.$router.replace({ name: '404'});
                }
                next();
            },
            created (){
                this.loadData().then(response => {
                    // var temp_repo = this.findRepoByName('Stores Banner');
                    // if(temp_repo) {
                    //     this.pageBanner = temp_repo.images[0];
                    // }
                    
                    this.updateCurrentStore(this.id);
                    this.dataLoaded = true;
                });
            },
            watch: {
                // currentStore: function() {
                //     console.log(this.currentStore)
                //     console.log(this.currentStore.store_front_url_abs)
                //     if ( _.includes(this.currentStore.store_front_url_abs, 'missing')) {
                //         this.currentStore.store_front_url_abs = "//codecloud.cdn.speedyrails.net/sites/5a81f86a6e6f6404f6030000/image/png/1516652189884/ES_logo_red2.png";
                //     }
                    
                    
                // },
                locale: function(val, oldVal) {
                    console.log("locale", this.locale);
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'findStoreBySlug',
                    'findCategoryById',
                    'findHourById',
                ]),
                storeCategory() {
                    var currentStoreCategory = this.currentStore.categories[0];
                    category = this.findCategoryById(currentStoreCategory)
                    return category.name
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "categories")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                updateCurrentStore (id) {
                    this.currentStore = this.findStoreBySlug(id);
                    if (this.currentStore === null || this.currentStore === undefined){
                        this.$router.replace({ path: '/'});
                    } else {
                        // STORE LOGO
                        if (_.includes(this.currentStore.store_front_url_abs, 'missing')) {
                            this.currentStore.no_logo = true
                        } else {
                            this.currentStore.no_logo = false
                        }
                        // STORE HOURS
                        var vm = this;
                        var storeHours = [];
                        _.forEach(this.currentStore.store_hours, function (value, key) {
                            hours = vm.findHourById(value)
                            today = moment().day();
                            if( today == hours.day_of_week ){
                                hours.todays_hours = true;
                            } else {
                                hours.todays_hours = false;
                            }
                            storeHours.push(hours);
                        });
                        this.storeHours = _.sortBy(storeHours, function(o) { return o.day_of_week });
                    
                    }
                }
            }
        });
    });
</script>