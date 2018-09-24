<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
    						<h1>{{ $t("jobs_page.jobs") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="margin_60"></div>
                <div v-if="dataLoaded" v-cloak class="site_container">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="details_store_name">
                                <h2>{{ currentJob.name }}</h2>
                                <p v-if="storeCategory" class="store_category">{{ storeCategory }}</p>
                                <h3 v-if="currentJob.phone" class="store_phone"><span>{{ currentJob.phone }}</span><i class="fa fa-phone"></i></h3>
                                <div class="">
                                    <a v-if="currentJob.website" :href="currentJob.website" target="_blank">
                                        <div class="store_website animated_btn caps">{{ $t("stores_page.store_website") }}</div>
                                    </a>
                                    <div class="store_website animated_btn caps">{{ $t("stores_page.view_map") }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
            				<div class="details_store_image">
            				    <div v-if="currentJob.no_logo" class="store_details_image center-block">
                                    <div class="no_logo">
                                        <p class="store_details_name">{{ currentJob.name }}</p>
                                    </div>    
                                </div>
                                <img v-else class="store_details_image center-block" :src="currentJob.store_front_url_abs" :alt="currentJob.name + ' Logo'" />
            				</div>
            			</div>
            		</div>
            		<div class="row">
                        <div class="col-md-5">
            				<div class="details_store_hours">
            				    <h4 class="details_store_title caps">{{ $t("stores_page.store_hours") }}</h4> 
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
            				    <h4 class="details_store_title caps">{{ currentJob.name }}</h4>
            				    <div v-html="currentJob.description"></div>
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
        return Vue.component("job-details-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner:null,
                    currentJob: null,
                    storeJobs : null
                }
            },
            props:['id', 'locale'],
            beforeRouteUpdate(to, from, next) {
                this.currentJob = this.findJobBySlug(to.params.id);
                    if (this.currentJob === null || this.currentJob === undefined){
                        this.$router.replace({ name: '404'});
                    }
                next();
            },
            created(){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Jobs Banner');
                    if(temp_repo) {
                        this.pageBanner = temp_repo.images[0];
                    }
                    
                    this.dataLoaded = true;
                    this.updateCurrentJob(this.id);
                });
            },
            watch: {
                currentJob : function (){
                    var property_name = this.property.name
                    if(this.currentJob != null) {
                        if (this.currentJob.store != null && this.currentJob.store != undefined){
                            if(_.includes(this.currentJob.store.image_url, 'missing')) {
                                this.currentJob.image_url = "https://via.placeholder.com/400x400/757575";
                            } else {
                                this.currentJob.image_url = this.currentJob.store.store_front_url_abs
                            }
                            this.currentJob.store_name = this.currentJob.store.name;
                            // this.currentJob.category = 
                        } else if (this.currentJob.store == null || this.currentJob.store == undefined) {
                            this.currentJob.store = {};
                            this.currentJob.image_url =  "https://via.placeholder.com/400x400/757575";
                            this.currentJob.store_name = property_name;
                        }
                    }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'findJobBySlug'
                ])
            },
            methods: {
                updateCurrentJob (id) {
                    this.currentJob = this.findJobBySlug(id);
                    if (this.currentJob === null || this.currentJob === undefined){
                        this.$router.replace({ name: '404'});
                    }
                },
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "jobs")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                checkJobType(promo) {
                    if(this.locale != "en-ca") {
                        if(promo.job_type == "Full Time"){
                            return "Plein Temps"
                        } else if (promo.job_type == "Part Time"){
                            return "Mi Temps"
                        } else if (promo.job_type == "Full Time/Part Time"){
                            return "Plein/Mi Temps"
                        } else if (promo.job_type == "Seasonal"){
                            return "Travail Saisonnier"
                        }
                    } else {
                        return promo.job_type
                    }
                }
            }
        });
    });
</script>