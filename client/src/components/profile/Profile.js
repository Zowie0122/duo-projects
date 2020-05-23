import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import { getProfileById } from "../../actions/profile";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Profile = ({ getProfileById, profile: { profile }, auth, match }) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  const [pdfContent, setPdfContent] = useState("");

  const jsPDFGenerator = () => {
    if (profile) {
      let doc = new jsPDF("p", "pt");
      var text = [];
      const list = [];
      list.push(profile.user.name);

      list.push("Skills");

      profile.skills.forEach((element) => {
        list.push(element);
      });

      list.push("Education");
      profile.education.forEach((ele) => {
        for (let key in ele) {
          console.log(key);
          console.log(ele[key]);
          if (key !== "_id") {
            list.push(`${key.toString()}:${ele[key]}`);
          }
        }

        console.log(ele);
      });

      list.push("Experience");

      profile.experience.forEach((ele) => {
        for (let key in ele) {
          console.log(key);
          console.log(ele[key]);
          if (key !== "_id") {
            list.push(`${key.toString()}:${ele[key]}`);
          }
        }

        console.log(ele);
      });

      for (var i of list) {
        text.push(i);
      }
      doc.text(text, 20, 20);

      doc.save("generated.pdf");
    }
  };

  console.log(profile);

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((experience) => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience</h4>
              )}
            </div>

            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((education) => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No education</h4>
              )}
            </div>
          </div>
          <button className="btn btn-dark" onClick={jsPDFGenerator}>Download PDF</button>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
