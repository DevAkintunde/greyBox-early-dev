//import and define custom database Models defined in App
//define routes
import Router from "@koa/router";

/* Models */
export const ModelMapper = {
    service: 'Service'
}

const router = new Router({
  prefix: "/app",
});

// pages entity routes
router.get('/', async(ctx, next)=>{
    console.log('we are here')
});

export default router;
