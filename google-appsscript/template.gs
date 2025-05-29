function getTemplate() {
    function sidebar(){
      return `
        <!-- Sidebar -->
        <div id="sidebar" class="sidebar" style="display: none;" data-color="black" data-active-color="info">
            <div class="logo" style="display: none;">
							<a href="https://www.creative-tim.com" class="simple-text logo-mini">
								<div class="logo-img"><img src="" alt="react-logo"></div>
							</a>
							<a href="#" class="simple-text logo-normal">Creative Tim</a>
						</div>
            <div class="sidebar-wrapper">
              <ul class="nav">
                <li class="">
                  <a aria-current="page" class="nav-link dashboard" href="#">
                    <i class="nc-icon nc-bank"></i>
                    <p>Dashboard</p>
                  </a>
                </li>
                <li class="">
                  <a class="nav-link all-tardies" href="#">
                    <i class="nc-icon nc-hat-3"></i>
                    <p>All Tardies</p>
                  </a>
                </li>
                <li class="active">
                  <a class="nav-link class-tardies active" href="#">
                    <i class="nc-icon nc-hat-3"></i>
                    <p>Class Tardies</p>
                  </a>
                </li>
              </ul>
            </div>
        </div>
      `
    }
    return `
<!DOCTYPE html>
<html>
<head>
    <base target="_top">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    {{head_meta}}
    <title>{{head_title}}</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet">
    <link href="https://demos.creative-tim.com/paper-dashboard-react/static/css/2.2932bf66.chunk.css" rel="stylesheet">
    <link href="https://demos.creative-tim.com/paper-dashboard-react/static/css/main.e1d0bd8d.chunk.css" rel="stylesheet">
    {{stylesheet}}
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
    <script src="https://code.jquery.com/ui/1.10.3/jquery-ui.js" crossorigin="anonymous"></script>
    {{head_end}}
    {{app_data}}
    <script>
        ${javascript}
    </script>
</head>
<body>
    {{body_start}}
    <div id="root">
        <div class="wrapper">
            ${sidebar()}
            <!-- Main Panel -->
            <div class="main-panel p-0 col-sm-12 col-md-12 col-lg-12">
                <!-- Nav -->
                <nav class="navbar-absolute fixed-top navbar-transparent navbar navbar-expand-lg bg-transparent" style="display: none;">
                    <div class="container-fluid">{{nav_top}}</div>
                </nav>
                <!-- content -->
                <div class="content mt-3 pb-0">
                    {{content}}
                </div>
                <!-- Footer -->
                <footer class="footer p-0">
                    <div class="container-fluid">
                        <div class="row">
                            <nav class="footer-nav">
                                <ul>
                                    <li>
                                        <a href="#" target="_blank">Carver Steam</a>
                                    </li>
                                </ul>
                            </nav>
                            <div class="credits ml-auto">
                                <div class="copyright">© 2024, made by KipSoft</div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" crossorigin="anonymous"></script>
    {{body_end}}
</body>

</html>

    
    `;
}
