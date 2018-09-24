<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="page_header hidden_phone" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{ $t("jobs_page.jobs") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container">
    				<paginate name="promos" v-if="promos.length > 0" :list="promos" class="paginate-list margin-60" :per="4">
    				    <div class="promo_container jobs clearfix" v-for="(promo, index) in paginated('promos')">
    					    <div class="promo_img" v-lazy:background-image="promo.image_url"></div>
    					    <div class="promo_content">
    					        <h2>{{ promo.store_name }}</h2>
    					        <p v-if="promo.store_category">{{ promo.store_category }}</p>
    							<hr>
    					        <p class="job_position" v-if="locale=='en-ca'">{{ $t("jobs_page.position") }}: {{ promo.name }}</p>
    					        <p class="job_position" v-else>{{ $t("jobs_page.position") }}: {{ promo.name_2 }}</p>
    					        <p class="job_position" v-if="promo.job_type">{{ $t("jobs_page.job_type") }}:  {{ checkJobType(promo) }}</p>
    							<p class="job_date">{{ $t("jobs_page.end_date") }}: {{promo.end_date | moment("MMMM DD, YYYY", timezone)}}</p>
    							<router-link :to="'/jobs/'+ promo.slug" >
								   <div class="promo_learn_more animated_btn">{{ $t("jobs_page.read_more") }}</div>
    						    </router-link>
    					    </div>
    					</div>
    				</paginate>
        			<div class="row no_promos" v-else>
        				<div class="col-md-12">
        					<p>{{$t("jobs_page.no_job_message")}}</p>
        				</div>
        			</div>
        			<div class="row margin-60">
        				<div class="col-md-12">
        					<paginate-links for="promos" :async="true" :limit="5" :show-step-links="true"></paginate-links>
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
                    paginate: ['promos'],
                    promos : null
                }
            },
            created() {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    var temp_repo = this.findRepoByName('Jobs Banner');
                    if(temp_repo) {
                        this.pageBanner = temp_repo.images[0];
                    }
                    this.promos = this.promotions;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'processedJobs'
                ]),
                promotions() {
                    var property_name = this.property.name
                    var vm = this;
                    var temp_promo = [];
                    var temp_job = [];
                    console.log(this.processedJobs)
                    _.forEach(this.processedJobs, function(value, key) {
                        
                        if (value.store != null && value.store != undefined) {
                            if(_.includes(value.store.image_url, 'missing')) {
                                value.image_url = "https://via.placeholder.com/400x400/757575";
                            } else {
                                value.image_url = value.store.store_front_url_abs;  
                            }
                            value.store_name = value.store.name;
                            value.store_category = vm.getStoreCategories(value.store.categories);
                        } else if (value.store == null || value.store == undefined) {
                            value.store = {};
                            value.image_url =  "https://via.placeholder.com/400x400/757575";
                            value.store_name = property_name;
                        }
                        
                        temp_promo.push(value);
                    });
                    _.sortBy(temp_promo, [function(o) { return o.start_date; }]);
                    return temp_promo;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "jobs"), this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                getStoreCategories(categories) {
                    console.log(categories)
                    var currentStoreCategory = this.currentStore.categories[0];
                    category = this.findCategoryById(currentStoreCategory)
                    return category.name
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