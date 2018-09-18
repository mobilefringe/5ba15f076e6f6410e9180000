<template>
    <footer>
		<div class="site_container">
		    <div class="row footer_logo">
		        <div class="col-md-3 center-block">
		            <div class="property_logo">
				        <router-link to="/">
				            <img src="https://via.placeholder.com/150x75" alt="Property Logo"/>
			            </router-link>
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
    </footer>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function (Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("footer-component", {
            template: template, // the variable template will be injected,
            data: function data() {
                return {

                }
            },
            props:['footer_menu_items', 'social_media'],
            // created() {
            //     this.loadData().then(response => {
            //         this.dataLoaded = true;

            //     });
            // },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                ]),
                copyright_year() {
                    return moment().year();
                }
            }
        });
    });
</script>