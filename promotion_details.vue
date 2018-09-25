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
        		    <div class="promo_container" v-if="currentPromo">
					    <div class="promo_img" v-if="locale=='en-ca'" v-lazy:background-image="currentPromo.image_url"></div>
					    <div class="promo_img" v-else v-lazy:background-image="currentPromo.promo_image2_url_abs"></div>
					    <div class="promo_content">
					        <p class="promo_title" v-if="currentPromo.store">{{ currentPromo.store.name }}</p>
					        <p class="promo_title" v-else>{{ property.name }}</p>
					        <h3 class="center caps" v-if="locale=='en-ca'">{{ currentPromo.name_short }}</h3>
							<h3 class="center caps" v-else>{{ currentPromo.name_short_2 }}</h3>
							<router-link :to="'/promotions/'+ currentPromo.slug">
							   <div class="promo_learn_more animated_btn">{{ $t("promos_page.read_more") }}</div>
						    </router-link>
					    </div>
					</div>
    					
        	<!--		<div id="promos_container">-->
    					<!--<div class="promo_container">-->
    					<!--    <div class="promo_content center">-->
    					<!--        <p class="promo_title" v-if="currentPromo.store">{{ currentPromo.store.name }}</p>-->
    					<!--        <p class="promo_title" v-else>{{ property.name }}</p>-->
    					<!--        <h3 class="margin_60" v-if="locale=='en-ca'">{{ currentPromo.name }}</h3>-->
    					<!--		<h3 class="margin_60" v-else>{{ currentPromo.name_2 }}</h3>-->
    					<!--		<p class="promo_desc">-->
    					<!--		    {{ currentPromo.start_date | moment("MMM D", timezone) }} - {{ currentPromo.end_date | moment("MMM D", timezone) }}-->
    					<!--		</p>-->
    					<!--    </div>-->
    					<!--    <div class="promo_img" v-if="locale=='en-ca'" v-lazy:background-image="currentPromo.image_url"></div>-->
    					<!--    <div class="promo_img" v-else v-lazy:background-image="currentPromo.promo_image2_url_abs"></div>-->
    					
    				<div class="row">
    				    <div class="col-md-12">
            				<div class="details_store_desc">
            				    <h4 class="details_store_title">{{ currentPromo.name }}</h4>
            				    <div v-if="locale=='en-ca'" v-html="currentPromo.rich_description"></div>
				                <div v-else v-html="currentPromo.rich_description_2"></div>
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
        return Vue.component("promo-details-component", {
            template: template, // the variable template will be injected,
            props:['id', 'locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    currentPromo: null
                }
            },
            beforeRouteUpdate(to, from, next) {
                this.currentPromo = this.findPromoBySlug(to.params.id);
                    if (this.currentPromo === null || this.currentPromo === undefined){
                        this.$router.replace({ name: '404'});
                    }
                next();
                this.dataLoaded = true;
            },
            created(){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Promotions Banner');
                    if (temp_repo) {
                        try {
                            this.pageBanner = temp_repo.images[0];
                        } catch(e) {
                            
                        }
                    } else {
                        this.pageBanner = { "image_url": "https://via.placeholder.com/1920x300" }
                    }
                    
                    this.updateCurrentPromo(this.id);
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'processedPromos',
                    'findPromoBySlug',
                    'findPromoById'
                ])
            },
            methods: {
                updateCurrentPromo (id) {
                    this.currentPromo = this.findPromoBySlug(id);
                    if (this.currentPromo != null || this.currentPromo != undefined){
                        this.currentPromo.name_short = _.truncate(this.currentPromo.name, { 'length': 21, 'separator': ' ' });
                        this.currentPromo.name_short_2 = _.truncate(this.currentPromo.name_2, { 'length': 21, 'separator': ' ' });
            
                        if(_.includes(this.currentPromo.image_url, 'missing')) {
                            this.currentPromo.image_url = "https://via.placeholder.com/1560x800/757575";
                        }
                        if(_.includes(this.currentPromo.promo_image2_url_abs, 'missing')) {
                            this.currentPromo.promo_image2_url_abs = "https://via.placeholder.com/1560x800/757575";
                        }
                           
                    } else {
                        this.$router.replace({ name: '404'});
                    }
                },
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "promotions")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
    });
</script>