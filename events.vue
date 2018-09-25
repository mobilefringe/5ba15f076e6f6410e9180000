<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{ $t("promos_page.promos_header") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container page_content">
        		    <transition-group name="list" tag="div">
    					<div class="promo_container" v-if="promos" v-for="promo in promos" :key="promo.id">
    					    <div class="promo_img" v-if="locale=='en-ca'" v-lazy:background-image="promo.image_url"></div>
    					    <div class="promo_img" v-else v-lazy:background-image="promo.promo_image2_url_abs"></div>
    					    <div class="promo_content">
    					        <p class="promo_title" v-if="promo.store">{{ promo.store.name }}</p>
    					        <p class="promo_title" v-else>{{ property.name }}</p>
    					        <h3 class="center caps" v-if="locale=='en-ca'">{{ promo.name_short }}</h3>
    							<h3 class="center caps" v-else>{{ promo.name_short_2 }}</h3>
    							<router-link :to="'/promotions/'+ promo.slug">
    							   <div class="promo_learn_more animated_btn">{{ $t("promos_page.read_more") }}</div>
    						    </router-link>
    					    </div>
    					</div>
    					<div v-else>
                            <div class="row">
                                <div class="col-md-12">
                                    <p>{{$t("promos_page.no_promo_message")}}</p>    
                                </div>
                            </div>
                        </div>
    				</transition-group>
        			<div class="row">
                        <div class="col-md-12">
                            <button class="animated_btn promo_load_more" v-if="!noMorePromos" @click="handleButton">Load More</button>
                            <p v-if="noPromos">{{$t("promos_page.no_more_promo_message")}}</p>
                        </div>
                    </div>
        		</div>
	        </div>
	    </transition>
	</div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta", "vue-lazy-load", "vue-paginate"], function(Vue, Vuex, moment, tz, VueMoment, Meta, VueLazyload, VuePaginate) {
        Vue.use(Meta);
        Vue.use(VueLazyload);
        Vue.use(VuePaginate);
        return Vue.component("promos-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    promos : null,
                    paginate: ['promos']
                }
            },
            created() {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    
                    var temp_repo = this.findRepoByName('Events Banner');
                    if(temp_repo) {
                        this.pageBanner = temp_repo.images[0];
                    }

                    this.promos = this.events;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'processedEvents'
                ]),
                events() {
                    var vm = this;
                    var temp_event = [];
                    var temp_job = [];
                    _.forEach(this.processedEvents, function(value, key) {
                        value.name_short = _.truncate(value.name, { 'length': 21, 'separator': ' ' });
                        value.name_short_2 = _.truncate(value.name_2, { 'length': 21, 'separator': ' ' });
                        value.description_short = _.truncate(value.description, { 'length': 60, 'separator': ' ' });
                        value.description_short_2 = _.truncate(value.description_2, { 'length': 60, 'separator': ' ' });

                        if (_.includes(value.image_url, 'missing')) {
                            value.image_url = "https://placehold.it/1560x800/757575";
                        }
                        if (_.includes(value.event_image2_url_abs, 'missing')){
                            value.event_image2_url_abs  = "https://placehold.it/1560x800/757575";
                        }

                        temp_event.push(value);
                    });
                    _.sortBy(temp_event, [function(o) { return o.start_date; }]);
                    return temp_event;
                },
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "events")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
    });
</script>